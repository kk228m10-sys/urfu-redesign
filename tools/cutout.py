# Cut a figure out of a light studio background (pure white, or the grey "transparency" checker some
# generators bake into a JPEG) and save it as a PNG with an alpha channel.
#   python -E -P tools/cutout.py <in.jpg> <out.png> [light=215]
# Background = light pixels (>= light) connected to the frame edge. The figure's outline is thickened
# first, so the fill cannot leak through a small gap into white sneakers or a white shirt.
# Edge pixels take the colour of the nearest figure pixel, so no white fringe shows on a coloured field.
# Needs Pillow, numpy and scipy (only for this step; the site itself needs no Python).
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, out = sys.argv[1], sys.argv[2]
light = int(sys.argv[3]) if len(sys.argv) > 3 else 215

a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
lum = a.mean(-1)
cand = lum >= light

barrier = ndi.binary_dilation(~cand, iterations=3)
lab, _ = ndi.label(~barrier)
edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, edge[edge > 0])
# An enclosed patch (inside a raised arm) is background too when it is as flat and as white as the
# frame edge; the light parts of the figure itself (a paper map, sneakers) are darker or textured.
ref = lum[bg].mean()
for k in range(1, lab.max() + 1):
    if k in edge: continue
    m = lab == k
    if m.sum() > 200 and abs(lum[m].mean() - ref) < 2.5 and lum[m].std() < 2: bg |= m
bg = ndi.binary_dilation(bg, iterations=4) & cand

fg = ndi.binary_opening(~bg, iterations=2)
fl, fn = ndi.label(fg)
sizes = ndi.sum(fg, fl, range(1, fn + 1))
fg = np.isin(fl, 1 + np.nonzero(sizes >= sizes.max() * 0.01)[0])
hl, hn = ndi.label(ndi.binary_fill_holes(fg) & ~fg)
if hn: fg |= np.isin(hl, 1 + np.nonzero(ndi.sum(np.ones(hl.shape), hl, range(1, hn + 1)) < 800)[0])  # specks only

core = ndi.binary_erosion(fg, iterations=1)
alpha = ndi.gaussian_filter(core.astype(np.float32), 0.9)
_, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
rgb = a[iy, ix]

ys, xs = np.nonzero(alpha > 0.02)
pad = 24
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, a.shape[0])
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, a.shape[1])
rgba = np.dstack([rgb, alpha[..., None] * 255]).clip(0, 255).astype(np.uint8)[y0:y1, x0:x1]
Image.fromarray(rgba, 'RGBA').save(out, optimize=True)
print(f'cut {out}: {x1 - x0}x{y1 - y0}, figure {int(fg.sum())} px')

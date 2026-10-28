# Trace the buildings of the campus map picture into polygons (assets/incoming/campus-map.jpg, not in git).
#   python -E -P tools/trace-plan.py assets/incoming/campus-map.jpg plan.json debug.jpg
#   node tools/gen-plan.mjs plan.json build/campus-plan.mjs
# Seeds are points inside each building of that particular picture: a new map needs new seeds.
import sys, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
import contourpy

src, out_json, out_png = sys.argv[1:4]
img = Image.open(src).convert('RGB')
a = np.asarray(img).astype(int)
H, W, _ = a.shape

# building id -> list of (seed x, seed y, tolerance)
SEEDS = {
  's':   [(468, 60, 40)],
  'sp':  [(570, 128, 30)],
  'e':   [(590, 200, 40)],
  'm':   [(800, 232, 45)],
  'guk': [(800, 320, 60)],
  'i':   [(620, 495, 45)],
  't':   [(820, 680, 40)],
  'f':   [(480, 580, 30)],
  'h':   [(95, 620, 45), (210, 600, 45)],
  'mt':  [(245, 580, 45), (168, 620, 45)],
  'r':   [(300, 880, 45)],
  'suv': [(95, 110, 45), (330, 120, 45), (172, 60, 45), (252, 60, 45)],
}

def grow(x, y, tol):
    c = a[y, x]
    m = np.sqrt(((a - c) ** 2).sum(-1)) < tol
    lab, _ = ndi.label(m)
    l = lab[y, x]
    assert l, f'seed {x},{y} outside its colour'
    return lab == l

def dp(pts, eps):
    # Ramer-Douglas-Peucker on an open polyline
    if len(pts) < 3: return pts
    s, e = pts[0], pts[-1]
    v = e - s
    n = np.hypot(*v)
    q = pts - s
    d = np.abs(v[0] * q[:, 1] - v[1] * q[:, 0]) / n if n else np.hypot(q[:, 0], q[:, 1])
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([dp(pts[:i + 1], eps)[:-1], dp(pts[i:], eps)])
    return np.vstack([s, e])

def outline(mask, eps=2.2):
    gen = contourpy.contour_generator(z=mask.astype(float))
    best = max(gen.lines(0.5), key=len)
    # split the closed ring at its two farthest points so DP keeps the corners
    i = 0; j = int(np.argmax(np.hypot(*(best - best[0]).T)))
    ring = best[:-1]
    a1 = dp(ring[i:j + 1], eps); a2 = dp(np.vstack([ring[j:], ring[:1]]), eps)
    poly = np.vstack([a1[:-1], a2[:-1]])
    return [[round(float(x), 1), round(float(y), 1)] for x, y in poly]

result = {'size': [W, H], 'buildings': {}}
dbg = img.copy().convert('RGBA')
over = Image.new('RGBA', img.size, (0, 0, 0, 0))
dr = ImageDraw.Draw(over)
for bid, seeds in SEEDS.items():
    mask = np.zeros((H, W), bool)
    for x, y, tol in seeds:
        mask |= grow(x, y, tol)
    mask = ndi.binary_closing(mask, iterations=7 if bid == 'suv' else 2)
    mask = ndi.binary_fill_holes(mask)
    mask = ndi.binary_dilation(mask, iterations=2)  # cover the black outline drawn round each fill
    lab, n = ndi.label(mask)
    parts = []
    for k in range(1, n + 1):
        part = lab == k
        if part.sum() < 60: continue
        parts.append(outline(part))
    dt = ndi.distance_transform_edt(mask)
    ly, lx = np.unravel_index(int(np.argmax(dt)), dt.shape)
    result['buildings'][bid] = {'polys': parts, 'label': [int(lx), int(ly)], 'room': round(float(dt.max()), 1), 'area': int(mask.sum())}
    for p in parts:
        dr.polygon([tuple(q) for q in p], outline=(0, 0, 0, 255), fill=(0, 0, 0, 90))
        for q in p: dr.ellipse([q[0] - 2, q[1] - 2, q[0] + 2, q[1] + 2], fill=(255, 0, 0, 255))
    dr.text((lx, ly), bid, fill=(255, 255, 0, 255))
    print(bid, 'parts', len(parts), 'verts', [len(p) for p in parts], 'label', (lx, ly), 'room', round(float(dt.max()), 1))

# parks: the two lawns of площадь Кирова, as boxes
for name, col, tol in [('park', (182, 228, 129), 40), ('park2', (218, 247, 189), 18)]:
    m = np.sqrt(((a - np.array(col)) ** 2).sum(-1)) < tol
    m = ndi.binary_closing(m, iterations=4)
    lab, n = ndi.label(m)
    sizes = ndi.sum(m, lab, range(1, n + 1))
    boxes = []
    for k in np.argsort(sizes)[::-1][:6]:
        if sizes[k] < 3000: continue
        sl = ndi.find_objects((lab == k + 1).astype(int))[0]
        boxes.append([sl[1].start, sl[0].start, sl[1].stop, sl[0].stop, int(sizes[k])])
    result[name] = boxes
    print(name, boxes)

# pink passages
pinkish = (a[..., 0] > 140) & (a[..., 2] > 140) & (a[..., 1] < a[..., 0] - 30) & (a[..., 1] < a[..., 2] - 30)
pinkish = ndi.binary_closing(pinkish, iterations=3)
lab, n = ndi.label(pinkish)
links = []
for k in range(1, n + 1):
    ys, xs = np.nonzero(lab == k)
    if len(xs) < 25: continue
    # principal axis end points
    c = np.array([xs.mean(), ys.mean()])
    u, s, vt = np.linalg.svd(np.stack([xs - c[0], ys - c[1]], 1), full_matrices=False)
    ax = vt[0]
    t = (np.stack([xs, ys], 1) - c) @ ax
    p0 = c + ax * t.min(); p1 = c + ax * t.max()
    links.append([round(float(p0[0]), 1), round(float(p0[1]), 1), round(float(p1[0]), 1), round(float(p1[1]), 1), int(len(xs))])
    dr.line([tuple(p0), tuple(p1)], fill=(0, 0, 255, 255), width=3)
result['links'] = links
print('links', links)
Image.alpha_composite(dbg, over).convert('RGB').save(out_png, quality=90)
json.dump(result, open(out_json, 'w'), ensure_ascii=False)

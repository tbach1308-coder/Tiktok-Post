// ================= BIA SANG TAO (thumbnail) - helper chung 2 kenh (29/10) =================
// Nap trong file slide cua bai (Laptop slides/<bai>_slides.jsx hoac iPad bai.part.jsx), truoc t1 / truoc slide 1:
//   $.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
// Can san tu thu vien: text, rect, oval, bb, fx, fxGlow, placeSO, F (font UTM), FS (Source Serif).
// File chi ASCII (chu Viet trong code nay viet khong dau / \u).
// Thu tu dung bia: nen bg-thumb -> (soTo neu co) -> lopBia (anh do prep/bia_lop.py ghep) -> chu tieu de -> sticker / vsBadge -> cau moc.

var BIA_YEL = "FFD60A", BIA_INK = "111827";

// lop anh bia 1080x1440 nen trong suot (prep/bia_lop.py): dat vao la khop khung, khong do, khong keo
function lopBia(file, name) {
  var L = placeSO(file, name || "Anh bia");
  return L;
}

// dua cac layer vao 1 nhom (phan tu sau nam tren), tra ve nhom
function biaNhom(name, ls) {
  var g = app.activeDocument.layerSets.add(); g.name = name;
  for (var i = 0; i < ls.length; i++) ls[i].move(g, ElementPlacement.INSIDE);
  for (var k = 1; k < ls.length; k++) ls[k].move(ls[k - 1], ElementPlacement.PLACEBEFORE);   // phan tu sau nam tren (khong tin thu tu INSIDE)
  return g;
}

// sticker chu nghieng: kieu "trang" (nen trang chu den), "xanh" (nen xanh chu trang), "vang", "do", "xanhduong"
function sticker(str, cx, cy, rot, kieu, size) {
  size = size || 34;
  var MAU = { trang: ["FFFFFF", BIA_INK], xanh: ["22C55E", "FFFFFF"], vang: [BIA_YEL, BIA_INK], "do": ["EF4444", "FFFFFF"], xanhduong: ["3B82F6", "FFFFFF"] };
  var m = MAU[kieu] || MAU.trang;
  var T = text(str, F.B, size, m[1], 0, 300, { name: "Sticker - chu" });
  var b = bb(T), w = b[2] - b[0];
  var padX = Math.round(size * 0.62), hh = Math.round(size * 1.75);
  T.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
  var R = rect(cx - w / 2 - padX, cy - hh / 2, cx + w / 2 + padX, cy + hh / 2, Math.round(hh * 0.28), m[0], "Sticker - nen");
  fx(R, { shadow: { op: 50, dist: 8, blur: 16 } });
  var g = biaNhom("Sticker " + str, [R, T]);
  if (rot) g.rotate(rot, AnchorPosition.MIDDLECENTER);
  return g;
}

// huy hieu VS tron vang giua 2 may
function vsBadge(cx, cy, r, rot) {
  r = r || 70;
  var O = oval(cx - r, cy - r, cx + r, cy + r, BIA_YEL, "VS - nen");
  fx(O, { stroke: { hex: "FFFFFF", size: 5 }, shadow: { op: 60, dist: 8, blur: 20 } });
  var T = text("VS", FS.T, Math.round(r * 0.95), BIA_INK, 0, 300, { name: "VS - chu" });
  var b = bb(T); T.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
  var g = biaNhom("VS", [O, T]);
  if (rot) g.rotate(rot, AnchorPosition.MIDDLECENTER);
  return g;
}

// so / chu RAT TO mo phia sau may (bai top N, ngan sach, gia): dung TRUOC lopBia de nam duoi anh
function soTo(str, cx, cy, size, op, hex) {
  var T = text(str, FS.T, size || 620, hex || BIA_YEL, 0, 900, { name: "So to " + str });
  var b = bb(T); T.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
  T.opacity = op || 18;
  return T;
}

// mui ten cong tay (vach tron) tu (x1,y1) toi (x2,y2): chi vao chi tiet tren may
function muiTen(x1, y1, x2, y2, hex) {
  hex = hex || "FFFFFF";
  var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, th = 7, hl = 26, hw = 26;
  function P(s, t) { return [x1 + ux * s + nx * t, y1 + uy * s + ny * t]; }
  var A = poly([P(0, -th / 2), P(L - hl, -th / 2), P(L - hl, -hw / 2), P(L, 0), P(L - hl, hw / 2), P(L - hl, th / 2), P(0, th / 2)], hex, "Mui ten");
  fx(A, { shadow: { op: 50, dist: 4, blur: 10 } });
  return A;
}

// ================= SLIDE CUOI: Follow + comment ngang nhau (fen chot 30/10) =================
// 2 the kinh bang nhau: tren = cau hoi chon + loi goi comment (chu theo theme kenh, code slide tu viet),
// duoi = khoiFollow(): dong loi ich follow + nut Follow to co glow + mui ten chi len avatar TikTok (dau + de follow).
// Toa do avatar TikTok tren anh 3:4 (cot nut ben phai): khoang x 1000, y 640-720 -> mui ten dung o (930, 700).
function khoiFollow(handle, loiIch, cy, hint) {
  var L = text(loiIch, F.B, 40, "FFFFFF", 540, 0, { align: Justification.CENTER, maxW: 840, name: "Follow - loi ich" });
  var b = bb(L); L.translate(540 - (b[0] + b[2]) / 2, cy - 118 - (b[1] + b[3]) / 2);
  fx(L, { shadow: { op: 65, dist: 2, blur: 6 } });
  var T = text("+  Follow " + handle, F.B, 46, "FFFFFF", 0, 300, { name: "Follow - chu" });
  var tb = bb(T), w = tb[2] - tb[0], padX = 56, hh = 112;
  T.translate(540 - (tb[0] + tb[2]) / 2, cy - (tb[1] + tb[3]) / 2);
  var R = rect(540 - w / 2 - padX, cy - hh / 2, 540 + w / 2 + padX, cy + hh / 2, hh / 2, "22C55E", "Follow - nut");
  fxGlow(R, { glow: { hex: "4ADE80", op: 60, size: 30 }, shadow: { op: 55, dist: 8, blur: 20 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  var xr = 540 + w / 2 + padX;
  var A = muiTen(Math.min(xr + 6, 930), cy - 24, 938, 700, "FFFFFF");   // tu canh phai nut len avatar, khong cat qua dong chu
  var H = text(hint || "B\u1EA5m d\u1EA5u + \u1EDF avatar b\u00EAn ph\u1EA3i", F.B, 28, "BBF7D0", 540, 0, { align: Justification.CENTER, maxW: 840, name: "Follow - goi y" });
  var hb = bb(H); H.translate(540 - (hb[0] + hb[2]) / 2, cy + hh / 2 + 40 - (hb[1] + hb[3]) / 2);
  fx(H, { shadow: { op: 65, dist: 2, blur: 6 } });
  return [bb(L)[1], bb(H)[3]];
}

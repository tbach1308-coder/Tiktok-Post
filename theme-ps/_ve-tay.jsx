// _ve-tay.jsx: chu thich ve tay, CHI ghep vao theme co "ve_tay": true trong theme.json (fen 14/11 15h24 "cai nay lam theme rieng di khong ap dung tat ca").
// tao.py noi file nay sau _dong-co.jsx. Theme khac khong co cac ham duoi day.
// ---------- chu thich ve tay (fen 14/11 13h48 gui anh "iPad Pro M5 11" / giá: 24tr500" + "lam dc may cai chu thich ve nhu hinh nay cho theme khong") ----------
// Chu viet tay + mui ten cong ve tay + 2 gach chan duoi gia + (tuy chon) vien quanh mon do nhu cat dan sticker. Chi theme "Ảnh thật · Chú thích tay" (ve_tay: true).
// Font tay mac dinh Ink Free (giong anh mau nhat, du dau tieng Viet; KG Ten Thousand Reasons so 1 giong chu l nen xep sau).
// Net ve = vung chon da giac (thon 2 dau, rung nhe) to mau tren 1 lop thuong: khong bong, khong vien, sua mau bang Fill / Hue nhu lop thuong.
var FTAY = pick((THEME.font_tay || []).concat(["InkFree", "SegoePrint", "UTM-Duepuntozero", "SVN-KGTenThousandReasons", F.B]));
var TAY_HAT = 11;
function tayRand() { TAY_HAT = (TAY_HAT * 9301 + 49297) % 233280; return TAY_HAT / 233280; }
// diem tren duong cong bac 2 S -> E (diem keo K)
function tayCong(S, K, E, n) {
  var p = [];
  for (var i = 0; i <= n; i++) { var t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; p.push([a * S[0] + b * K[0] + c * E[0], a * S[1] + b * K[1] + c * E[1]]); }
  return p;
}
function tayTron(cx, cy, r) { var q = []; for (var i = 0; i < 16; i++) { var g = i / 16 * 6.2832; q.push([cx + r * Math.cos(g), cy + r * Math.sin(g)]); } return q; }
// 1 net qua cac diem p: day w, do day 2 dau thon = [dau, cuoi] (ti le), rung = do lech vuong goc toi da (px, 2 dau = 0). Tra ve cac da giac (than + 2 dau tron).
function tayNet(p, w, thon, rung) {
  var n = p.length, L = [], R = [], ph = tayRand() * 6.28, f = 0.6 + tayRand() * 1.2;
  thon = thon || [0.6, 0.6]; rung = rung == null ? 1.2 : rung;
  for (var i = 0; i < n; i++) {
    var a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / d, ny = dx / d, t = i / (n - 1);
    var k = t < 0.5 ? thon[0] + (1 - thon[0]) * Math.min(1, t / 0.2) : thon[1] + (1 - thon[1]) * Math.min(1, (1 - t) / 0.2);
    var o = rung * Math.sin(Math.PI * t) * Math.sin(ph + f * 6.2832 * t), cx = p[i][0] + nx * o, cy = p[i][1] + ny * o, ww = w * k / 2;
    L.push([cx + nx * ww, cy + ny * ww]); R.push([cx - nx * ww, cy - ny * ww]);
  }
  var out = [L.concat(R.reverse())], r0 = w * thon[0] / 2, r1 = w * thon[1] / 2;
  if (r0 >= 1) out.push(tayTron(p[0][0], p[0][1], r0));
  if (r1 >= 1) out.push(tayTron(p[n - 1][0], p[n - 1][1], r1));
  return out;
}
// to cac da giac len 1 lop moi
function tayVe(ps, mau, name) {
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.name = name || "Nét vẽ tay";
  for (var i = 0; i < ps.length; i++) doc.selection.select(ps[i], i ? SelectionType.EXTEND : SelectionType.REPLACE, 0, true);
  doc.selection.fill(col(mau)); doc.selection.deselect();
  return L;
}
// mui ten cong ve tay S -> E (mui nhon mo o E). K: diem keo (khong co thi cong theo goc vuong [S.x, E.y] neu dung, [E.x, S.y] neu ngang);
// cong: so (ti le do dai, am = cong nguoc) thay cho K.
function tayMuiTen(S, E, w, mau, name, huong, cong) {
  var dx = E[0] - S[0], dy = E[1] - S[1], d = Math.sqrt(dx * dx + dy * dy) || 1, mx = (S[0] + E[0]) / 2, my = (S[1] + E[1]) / 2, K;
  if (cong != null) K = [mx - dy / d * d * cong, my + dx / d * d * cong];
  else { var G = huong == "doc" ? [S[0], E[1]] : [E[0], S[1]]; K = [mx + (G[0] - mx) * 0.7, my + (G[1] - my) * 0.7]; }     // mac dinh ra ngang, cam doc vao mon do
  var p = tayCong(S, K, E, Math.max(16, Math.round(d / 7))), ps = tayNet(p, w, [0.5, 0.95], Math.min(2, d / 120));
  var tx = E[0] - K[0], ty = E[1] - K[1], tl = Math.sqrt(tx * tx + ty * ty) || 1, hl = Math.max(22, w * 5.5);
  tx /= tl; ty /= tl;
  for (var s = -1; s <= 1; s += 2) {
    var g = s * (26 + tayRand() * 8) * Math.PI / 180, bx = -tx, by = -ty, len = hl * (s < 0 ? 1 : 0.82);
    var hx = bx * Math.cos(g) - by * Math.sin(g), hy = bx * Math.sin(g) + by * Math.cos(g), A2 = [E[0] + hx * len, E[1] + hy * len];
    ps = ps.concat(tayNet(tayCong(E, [(E[0] + A2[0]) / 2 + hy * 2, (E[1] + A2[1]) / 2 - hx * 2], A2, 6), w * 0.95, [0.95, 0.45], 0));
  }
  return tayVe(ps, mau, name || "Mũi tên");
}
// 2 gach chan ve tay duoi doan [l, r] o do cao y
function tayGach(l, r, y, w, mau, name, mot) {
  var len = r - l, n = Math.max(10, Math.round(len / 10));
  var ps = tayNet(tayCong([l - 6, y + 3], [(l + r) / 2, y + 6 - tayRand() * 8], [r + 10, y - 2], n), w, [0.55, 0.4], 0.8);
  if (!mot) ps = ps.concat(tayNet(tayCong([l + 10, y + 16], [(l + r) / 2, y + 18 + tayRand() * 4], [r - 2, y + 11], n), w * 0.88, [0.5, 0.35], 0.8));
  return tayVe(ps, mau, name || "Gạch chân");
}
// vien quanh mon do (nhu cat dan sticker trong anh mau): Chon chu the (Select Subject) tren lop anh -> no rong + bo tron -> ke net. Loi thi bo qua.
function tayVienMon(L, mau, w, no) {
  var doc = app.activeDocument;
  try {
    doc.activeLayer = L;
    var d = new ActionDescriptor(); d.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
    executeAction(stringIDToTypeID("autoCutout"), d, DialogModes.NO);
    doc.selection.expand(new UnitValue(no || 16, "px"));
    doc.selection.smooth(24);
    var V = doc.artLayers.add(); V.name = "Viền món đồ";
    doc.selection.stroke(col(mau), w || 5, StrokeLocation.CENTER, ColorBlendMode.NORMAL, 100, false);
    doc.selection.deselect();
    return V;
  } catch (e) { try { doc.selection.deselect(); } catch (e2) {} RUN += "   chu thich: khong ve duoc vien mon do (" + e.message + ")\n"; return null; }
}
// 1 chu thich: it = { chu: "Tên\rdòng 2", gia: "24tr500" (tuy chon, them "giá: " + 2 gach chan), o: [x, y] goc tren trai (can "phai": goc tren phai, "giua": giua tren),
//   toi: [x, y] mui ten chi toi (khong co = khong mui ten), tu: "duoi" | "tren" | "trai" | "phai" (mui ten ra tu canh nao, mac dinh tu chon),
//   huong: "ngang" (mac dinh: ra ngang, cam doc vao mon do) | "doc" (ra doc, cam ngang),
//   xoay: do (am = nghieng len ben phai, mac dinh -4..-2), cong: so (tuy chon), co: co chu }
function chuThich1(it, i, mau, co) {
  var doc = app.activeDocument, ls = [], rows = [];
  co = it.co || co || THEME.tay_co || 46;
  var lead = Math.round(co * 1.18), can = it.can == "phai" ? Justification.RIGHT : (it.can == "giua" ? Justification.CENTER : Justification.LEFT);
  var nd = it.chu ? String(it.chu).split("\r").length : 0, P = null, Gc = null, base = co;
  if (it.chu) { var N = THEME_TEXT0(it.chu, FTAY, co, mau, 0, base, { lead: lead, align: can, name: "Chú thích - chữ" }); ls.push(N); rows.push([N]); }
  if (it.gia) {
    var yb = base + nd * lead, pre = it.gia_chu != null ? it.gia_chu : "giá: ";
    var row = [];
    if (pre) { var G1 = THEME_TEXT0(pre, FTAY, co, mau, 0, yb, { name: "Chú thích - chữ giá" }); row.push(G1); ls.push(G1); }
    P = THEME_TEXT0(String(it.gia), FTAY, co, mau, row.length ? bb(row[0])[2] + Math.round(co * 0.3) : 0, yb, { name: "Chú thích - giá" });
    row.push(P); ls.push(P); rows.push(row);
  }
  if (!ls.length) return null;
  // can cac hang theo kieu can (hang chu nhieu dong da tu can trong lop)
  var wmax = 0, rb = [];
  for (var r = 0; r < rows.length; r++) { var a = bb(rows[r][0]), z = bb(rows[r][rows[r].length - 1]); rb.push([a[0], z[2]]); wmax = Math.max(wmax, z[2] - a[0]); }
  var x0 = 1e9; for (var r2 = 0; r2 < rows.length; r2++) x0 = Math.min(x0, rb[r2][0]);
  for (var r3 = 0; r3 < rows.length; r3++) {
    var wr = rb[r3][1] - rb[r3][0], want = can == Justification.RIGHT ? wmax - wr : (can == Justification.CENTER ? (wmax - wr) / 2 : 0), dx = x0 + want - rb[r3][0];
    if (Math.abs(dx) > 0.5) for (var c = 0; c < rows[r3].length; c++) rows[r3][c].translate(dx, 0);
  }
  // dat ca cum chu vao o, roi moi ve gach chan (ve ngoai trang thi net bi cat mat)
  var t = 1e9, l = 1e9, rr = -1e9;
  for (var j = 0; j < ls.length; j++) { var q = bb(ls[j]); t = Math.min(t, q[1]); l = Math.min(l, q[0]); rr = Math.max(rr, q[2]); }
  var ax = can == Justification.RIGHT ? rr : (can == Justification.CENTER ? (l + rr) / 2 : l), mx = it.o[0] - ax, my = it.o[1] - t;
  for (var k = 0; k < ls.length; k++) ls[k].translate(mx, my);
  if (P) { var qp = bb(P); Gc = tayGach(qp[0], qp[2], qp[3] + 7, Math.max(3, co / 11), mau, "Chú thích - gạch chân"); ls.push(Gc); }
  // gom nhom + nghieng nhe nhu viet tay
  var Gr = doc.layerSets.add();
  Gr.name = "Chú thích " + (i + 1) + (it.chu ? " - " + String(it.chu).replace(/\r/g, " ").substr(0, 28) : "");
  for (var m = 0; m < ls.length; m++) { try { ls[m].move(Gr, ElementPlacement.INSIDE); } catch (e) { ls[m].move(Gr, ElementPlacement.PLACEATEND); } }
  var xo = it.xoay != null ? it.xoay : -2 - tayRand() * 2.5;
  if (xo) { try { Gr.rotate(xo, AnchorPosition.MIDDLECENTER); } catch (e2) { RUN += "   chu thich: khong nghieng duoc nhom (" + e2.message + ")\n"; } }
  if (it.toi) {
    var gb = bb(Gr), E = it.toi, cx = (gb[0] + gb[2]) / 2, cy = (gb[1] + gb[3]) / 2, ex = E[0] - cx, ey = E[1] - cy, tu = it.tu;
    if (!tu) tu = Math.abs(ey) > Math.abs(ex) * 0.7 ? (ey > 0 ? "duoi" : "tren") : (ex > 0 ? "phai" : "trai");
    var hb = Gc ? bb(Gc) : gb, S, cach = it.cach || 18;
    if (tu == "duoi") S = [hb[0] + (hb[2] - hb[0]) * (ex > 0 ? 0.72 : 0.28), hb[3] + cach];
    else if (tu == "tren") S = [gb[0] + (gb[2] - gb[0]) * (ex > 0 ? 0.72 : 0.28), gb[1] - cach];
    else if (tu == "phai") S = [Math.max(gb[2], hb[2]) + cach, (hb[1] + hb[3]) / 2 - (Gc ? 10 : 0)];
    else S = [Math.min(gb[0], hb[0]) - cach, (hb[1] + hb[3]) / 2 - (Gc ? 10 : 0)];
    var Mt = tayMuiTen(S, E, it.day || Math.max(3.5, co / 9.5), mau, "Chú thích - mũi tên", it.huong || "ngang", it.cong);
    try { Mt.move(Gr, ElementPlacement.INSIDE); } catch (e3) { try { Mt.move(Gr, ElementPlacement.PLACEATEND); } catch (e4) {} }
  }
  return Gr;
}
// chu thich tren trang da co anh: ds = [it, ...] toa do px tren trang 1080x1440; o = { mau, co }
function chuThich(ds, o) {
  o = o || {};
  var mau = o.mau || THEME.tay_mau || "FFFFFF", out = [];
  for (var i = 0; i < ds.length; i++) out.push(chuThich1(ds[i], i, ds[i].mau || mau, o.co));
  RUN += "   chu thich ve tay: " + ds.length + " cai, font " + FTAY + "\n";
  return out;
}
// ca trang: anh that + chu thich ve tay. Goi ngay sau newDoc.
// o = { anh, tam: [x, y] 0..1 (diem giu o giua trang khi anh phu kin), thu: 1 (< 1 = thu nho anh cho rong cho chu, nen trang lay mau goc anh, mep anh mo dan),
//       cy: tam anh theo chieu doc khi thu < 1 (mac dinh giua trang), toi: 0..60 (lam toi anh), vien: true | false (vien quanh mon do, mac dinh THEME.tay_vien),
//       mau: mau chu + net (anh toi: "FFFFFF", anh sang: "1C1C1C"), co: co chu, ds: [it, ...] }
// Toa do o / toi trong ds: so <= 1 la ti le tren ANH GOC (x / rong anh, y / cao anh: nhin anh goc roi uoc), so > 1 la px tren trang.
function anhChuThich(o) {
  o = o || {};
  var doc = app.activeDocument, f = themeTimAnh(o.anh), q = [0, 0, W, H], mau = o.mau || THEME.tay_mau || "FFFFFF";
  if (f) {
    var L = placeSO(f.fsName, "Ảnh thật - chú thích");
    q = bb(L);
    var w = q[2] - q[0], h = q[3] - q[1], thu = o.thu || 1, s = Math.max(W / w, H / h) * thu * 100;
    L.resize(s, s, AnchorPosition.TOPLEFT); q = bb(L); w = q[2] - q[0]; h = q[3] - q[1];
    var tm = o.tam || [0.5, 0.5], x, y;
    if (thu >= 1) { x = Math.min(0, Math.max(W - w, W / 2 - tm[0] * w)); y = Math.min(0, Math.max(H - h, H / 2 - tm[1] * h)); }
    else { x = Math.round((W - w) / 2 + (o.lech || 0)); y = Math.round((o.cy || H / 2) - h / 2); }
    L.translate(x - q[0], y - q[1]); q = bb(L);
    try { L.rasterize(RasterizeType.ENTIRELAYER); } catch (e) {}
    if (thu < 1) {
      // nen trang = mau goc anh, mep anh mo dan vao nen (khong lo duong cat)
      var hex = "111111";
      try { var cs = doc.colorSamplers.add([Math.max(0, q[0]) + 6, Math.max(0, q[1]) + 6]); hex = cs.color.rgb.hexValue; cs.remove(); } catch (e2) {}
      var Bg = rect(0, 0, W, H, 0, hex, "Nền theo ảnh"); Bg.move(L, ElementPlacement.PLACEAFTER);
      try {
        doc.activeLayer = L;
        var m = 40, l2 = Math.max(0, q[0]) + m, t2 = Math.max(0, q[1]) + m, r2 = Math.min(W, q[2]) - m, b2 = Math.min(H, q[3]) - m;
        doc.selection.select([[l2, t2], [r2, t2], [r2, b2], [l2, b2]], SelectionType.REPLACE, 0, false);
        doc.selection.feather(m);
        var c2t = charIDToTypeID, dm = new ActionDescriptor(), rf = new ActionReference();
        dm.putClass(c2t("Nw  "), c2t("Chnl"));
        rf.putEnumerated(c2t("Chnl"), c2t("Chnl"), c2t("Msk ")); dm.putReference(c2t("At  "), rf);
        dm.putEnumerated(c2t("Usng"), c2t("UsrM"), c2t("RvlS"));
        executeAction(c2t("Mk  "), dm, DialogModes.NO);
      } catch (e3) { RUN += "   chu thich: khong mo duoc mep anh (" + e3.message + ")\n"; }
      try { doc.selection.deselect(); } catch (e4) {}
    }
    if (o.vien != null ? o.vien : THEME.tay_vien) tayVienMon(L, mau, o.day_vien || 5, o.no_vien);
    if (o.toi > 0) { var O = rect(0, 0, W, H, 0, "000000", "Lớp tối ảnh"); O.opacity = o.toi; }
  } else RUN += "   chu thich: khong thay anh " + o.anh + "\n";
  var pw = q[2] - q[0], ph = q[3] - q[1];
  function P(v) { return v ? [v[0] <= 1 ? q[0] + v[0] * pw : v[0], v[1] <= 1 ? q[1] + v[1] * ph : v[1]] : v; }
  var ds = [], src = o.ds || [];
  for (var i = 0; i < src.length; i++) { var it = {}; for (var k in src[i]) it[k] = src[i][k]; it.o = P(src[i].o); it.toi = P(src[i].toi); ds.push(it); }
  return chuThich(ds, { mau: mau, co: o.co });
}
// bia theme "Ảnh thật · Chú thích tay": "POLY STORE" nho + tieu de viet tay (t2 co 1 gach chan ve tay) + dong nho chu khong chan, anh that co chu thich ve tay.
// o = { t1, t2?, nho?, vi_tri: "tren" (mac dinh, cum tieu de sat tren) | "duoi" (sat duoi), + cac khoa cua anhChuThich (anh, thu, cy, tam, toi, vien, mau, co, ds) }
// Cum tieu de cao ~ 64 -> 64 + 0.26 * H (vi_tri "tren"): dat anh (cy) va chu thich (o) tranh vung nay.
function biaChuThich(o) {
  o = o || {};
  var mau = o.mau || THEME.tay_mau || "FFFFFF", x0 = THEME.bia_x || 72, co = o.co_tieu || THEME.bia_co || 96, ls = [], q;
  anhChuThich(o);
  var B = THEME_TEXT0("POLY STORE", F.B, 22, mau, x0, 40, { track: 200, name: "Thương hiệu" });
  q = bb(B); B.translate(x0 - q[0], 0 - q[1]); q = bb(B); ls.push(B);
  var y = q[3] + 22;
  var T1 = THEME_TEXT0(o.t1 || "", FTAY, co, mau, x0, co, { name: "Tiêu đề - dòng 1" });
  q = bb(T1); T1.translate(x0 - q[0], y - q[1]); q = bb(T1); ls.push(T1); y = q[3] + Math.round(co * 0.14);
  if (o.t2) {
    var T2 = THEME_TEXT0(o.t2, FTAY, co, mau, x0, co, { name: "Tiêu đề - dòng 2" });
    q = bb(T2); T2.translate(x0 - q[0], y - q[1]); q = bb(T2); ls.push(T2);
    var Gt = tayGach(q[0], q[2], q[3] + 10, Math.max(4, co / 15), mau, "Tiêu đề - gạch chân", true); ls.push(Gt); y = bb(Gt)[3] + 20;
  }
  if (o.nho) {
    var N = THEME_TEXT0(o.nho, F.B, THEME.bia_co_phu || 34, mau, x0, 40, { maxW: W - 2 * x0, name: "Dòng nhỏ dưới tiêu đề" });
    q = bb(N); N.translate(x0 - q[0], y - q[1]); ls.push(N); y = bb(N)[3];
  }
  var dy = o.vi_tri == "duoi" ? H - 64 - y : 64;
  for (var i = 0; i < ls.length; i++) ls[i].translate(0, dy);
  RUN += "   bia chu thich: tieu de " + (64) + "-" + Math.round(y + dy) + "\n";
  return ls;
}

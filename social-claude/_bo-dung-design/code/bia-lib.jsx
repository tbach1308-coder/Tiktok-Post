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

// typoBia: bo cuc H Typography (fen 20/11, [iPad]) - chu la nhan vat chinh. dong = [[chu, hex, co, can]] (can 0 = trai x 96, 1 = phai x 984), xep tu y0 xuong, cach nhau gap px;
// dong dai hon 884px tu thu nho. Tra ve day dong cuoi (de dat may nho ben duoi: bia_lop.py --chu <day>). Mau xen vang / trang, ten loai co 150-190, cau nhan cuoi vua 884px (~124).
function typoBia(dong, y0, gap) {
  var y = y0, bot = y0;
  for (var i = 0; i < dong.length; i++) {
    var sz = dong[i][2];
    var L = text(dong[i][0], FS.T, sz, dong[i][1], 96, 300, { name: "Typo - dong " + (i + 1) });
    var b = bb(L);
    if (dong[i][3] == 2 || b[2] - b[0] > 884) { var s2 = Math.floor(sz * 884 / (b[2] - b[0])); L.remove(); L = text(dong[i][0], FS.T, s2, dong[i][1], 96, 300, { name: "Typo - dong " + (i + 1) }); b = bb(L); }   // can 2 = khoi can deu: dong vua dung 884px
    L.translate((dong[i][3] == 1 ? 984 - b[2] : 96 - b[0]), y - b[1]); b = bb(L);
    if (typeof fx == "function") fx(L, { shadow: { op: 58, dist: 0, blur: 28 } });
    y = b[3] + (gap || 10); bot = b[3];
  }
  return bot;
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

// ================= TIEU DE BIA: typography (skill typo-bia, 20/11) =================
// tieuDeBia(dong, o): dat chu tieu de bia dung bo nhan dien 2 kenh: Source Serif Black VANG, can trai thang mep chu
//   "POLY STORE" (can theo net chu), tu khoa TRANG (glow trang nhe), chu nghieng trang nho; tu chon co theo do dai tung dong.
// dong: mang cac dong, GIU DUNG CHU FEN (luat 17d, ham khong doi hoa / thuong). Ky hieu trong dong:
//   *TU KHOA* = chu trang;  _chu nghieng_ = Source Serif Italic trang nho, cung dong (vd "_tai Poly_").
//   vd tieuDeBia(["TOP 5 MAY TRAM", "*DELL* CHO KY SU"], { duoi: "tai Poly" })   (chu that viet co dau)
// o (deu khong bat buoc):
//   x        mep trai net chu (mac dinh = mep trai lop "Thuong hieu" / POLY STORE, khong co thi 100)
//   top      dinh chu hoa dong 1 (mac dinh = day POLY STORE + 64, khong co thi 230)
//   maxW     rong toi da (mac dinh 982 - x);  lap: ti le lap ngang toi da 1 dong (0.92)
//   nho/lon  co nho nhat / lon nhat (84 / 112);  lonNhan: dong CHI co tu khoa trang (124)
//   deu      true = moi dong cung 1 co;  nhip: co lon nhat <= nhip x co nho nhat (1.3)
//   co       [co dong 1, co dong 2, ...] dat tay theo vai tro (vd [74, 74, 119]: ten loai nho, cau nhan to), o trong / 0 = tu tinh
//   cachDong khoang 2 chan chu ~ cachDong x co (1.2);  nghieng: co chu _nghieng_ cung dong (48)
//   duoi     dong chu nghieng trang DUOI tieu de ("tai Poly", dong phu <= 6 chu); duoiCo (48, bia so sanh iPad 16g: 40); duoiCach (26)
//   yMax     day toi da ca khoi chu (khong de may, [Laptop] 17c): qua thi tu ha co
//   vang     mau vang (BIA_YEL);  ten: tien to ten lop;  nhom: false = khong gom vao nhom "Tieu de bia"
// Tra ve { box:[trai,tren,phai,duoi], co:[co tung dong], lop:[cac lop], log:"tieu de bia: ...\n" } -> LOG += r.log.
// Log co "CANH BAO" la chua dat typography (dong dai qua, cham may...): sua hoac ghi ly do.
function _tdbTach(s) {
  var out = [], re = /(\*[^*]+\*|_[^_]+_)/g, last = 0, m, sp = false;
  function day(t, k) {
    var lead = /^\s/.test(t), trail = /\s$/.test(t), c = t.replace(/^\s+|\s+$/g, "");
    if (c.length) { out.push({ t: c, k: k, sp: out.length > 0 && (sp || lead) }); sp = trail; } else sp = sp || t.length > 0;
  }
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) day(s.substring(last, m.index), "v");
    day(m[0].substring(1, m[0].length - 1), m[0].charAt(0) == "*" ? "w" : "i");
    last = m.index + m[0].length;
  }
  if (last < s.length) day(s.substring(last), "v");
  return out;
}
// ngat 1 dong dai qua thanh 2 o khoang trang gan giua (ngoai *...* / _..._), uu tien truoc chu noi, khong tach so + don vi.
// Chi la du phong: dong nen duoc ngat theo nghia tu truoc (skill typo-bia muc 2). Khong doi chu.
var TDB_NOI = /^(CHO|HAY|V\u00C0|D\u01AF\u1EDAI|\u1EDE|KHI|N\u00CAN|C\u1EE6A|V\u1EDAI|\u0110\u1EC2|L\u00C0|T\u1EA0I|TRONG|M\u00C0|NH\u01AFNG)$/;
var TDB_DV = /^(TRI\u1EC6U|TR|GB|TB|INCH|K|%|NGH\u00CCN|TRI\u1EC6U\?|GB\?)$/;
function _tdbNgat(s) {
  var tot = -1, diem = 1e9, sau = 0, k, ch;
  for (k = 0; k < s.length; k++) {
    ch = s.charAt(k);
    if (ch == "*" || ch == "_") sau = sau ? 0 : 1;
    if (ch != " " || sau) continue;
    var trai = s.substring(0, k).replace(/\s+$/, ""), phai = s.substring(k + 1).replace(/^\s+/, "");
    if (!trai.length || !phai.length) continue;
    var tTr = trai.split(" "), tPh = phai.split(" "), w1 = tTr[tTr.length - 1].replace(/[*_]/g, ""), w2 = tPh[0].replace(/[*_]/g, "");
    var d = Math.abs(trai.length - phai.length);
    if (TDB_NOI.test(w2)) d -= 0.25 * s.length;
    if (TDB_NOI.test(w1)) d += 0.5 * s.length;
    if (/^\d+$/.test(w1) && TDB_DV.test(w2)) d += s.length;
    if (w1 == "TOP") d += s.length;
    if (d < diem) { diem = d; tot = k; }
  }
  if (tot < 0) return null;
  return [s.substring(0, tot).replace(/\s+$/, ""), s.substring(tot + 1).replace(/^\s+/, "")];
}
function _tdbDo(str, font, size) { var L = text(str, font, size, "FFFFFF", 30, 760, { name: "tdb do" }); var b = bb(L); L.remove(); return b; }
function _tdbHop(ls) { var r = null; for (var i = 0; i < ls.length; i++) { var b = bb(ls[i]); if (!r) r = b.slice(0); else { r[0] = Math.min(r[0], b[0]); r[1] = Math.min(r[1], b[1]); r[2] = Math.max(r[2], b[2]); r[3] = Math.max(r[3], b[3]); } } return r; }
function tieuDeBia(dong, o) {
  o = o || {};
  var doc = app.activeDocument, R = 60, logC = "";
  // bai co theme Photoshop (may con / may dung chung): chu bia theo ham bia cua theme, khong dung kieu shop (fen 21/11 "may con khong sai kieu theme nay")
  var coTheme = (typeof THEME != "undefined") && THEME;
  if (coTheme) logC += "CANH BAO bai co theme " + (THEME.id || "") + ": chu bia phai theo ham bia cua theme (luat-theme.md), khong dung tieuDeBia; ";
  var vang = o.vang || (coTheme && THEME.vang ? THEME.vang : BIA_YEL), nho = o.nho || 84, lon = o.lon || 112, lonNhan = o.lonNhan || 124;
  var lap = o.lap || 0.92, nhip = o.nhip || 1.3, cd = o.cachDong || 1.2, ng = o.nghieng || 48;
  var tenT = o.ten || "Ti\u00EAu \u0111\u1EC1";
  // mep trai + dinh: theo lop POLY STORE neu co
  var brand = null; try { brand = doc.artLayers.getByName("Th\u01B0\u01A1ng hi\u1EC7u"); } catch (eB) { brand = null; }
  var bbB = brand ? bb(brand) : null;
  var x0 = (o.x != null) ? o.x : (bbB ? bbB[0] : 100);
  var top = (o.top != null) ? o.top : (bbB ? bbB[3] + 64 : 230);
  var maxW = o.maxW || Math.min(884, 982 - x0);
  // do 1 lan: chieu cao chu hoa, khoang trang
  var bH = _tdbDo("H", FS.T, R), bHH = _tdbDo("H H", FS.T, R);
  var capR = (760 - bH[1]) / R, spT = ((bHH[2] - bHH[0]) - 2 * (bH[2] - bH[0])) / R;
  var spI = 0;
  var D = [], i, j;
  dong = dong.slice(0);
  function beRong(seg) {   // [A (rong chu tieu de / 1 don vi co), Wi (rong phan nghieng co dinh)]
    var A = 0, Wi = 0;
    for (var q = 0; q < seg.length; q++) {
      var g = seg[q];
      if (g.k == "i") { var bi0 = _tdbDo(g.t, FS.I, ng); Wi += bi0[2] - bi0[0]; }
      else { var b0 = _tdbDo(g.t, FS.T, R); A += (b0[2] - b0[0]) / R; }
      if (q > 0) { var tr = seg[q - 1]; if (tr.k == "i") Wi += seg[q].sp ? spI : 0.03 * ng; else A += seg[q].sp ? spT : 0.03; }
    }
    return [A, Wi];
  }
  for (i = 0; i < dong.length; i++) D.push(_tdbTach(dong[i]));
  var coI = false;
  for (i = 0; i < D.length; i++) for (j = 0; j < D[i].length; j++) if (D[i][j].k == "i") coI = true;
  if (coI) { var bI = _tdbDo("h", FS.I, ng), bII = _tdbDo("h h", FS.I, ng); spI = (bII[2] - bII[0]) - 2 * (bI[2] - bI[0]); }
  // be rong tung dong: phan tieu de (ti le theo co) + phan nghieng (co dinh); dong can co < nho thi ngat du phong (toi da 3 dong)
  var co = [], chiTuKhoa = [], AA = [], WW = [];
  for (i = 0; i < D.length; i++) {
    var AW = beRong(D[i]), A = AW[0], Wi = AW[1], kw = true, coT = false;
    var vua = A > 0 ? Math.floor((lap * maxW - Wi) / A) : lon;
    if (vua < nho && D.length < 3) { var hai = _tdbNgat(dong[i]); if (hai) {
      logC += "tu ngat dong " + (i + 1) + " (dai qua): '" + hai[0] + "' / '" + hai[1] + "' -> soat lai cho ngat theo nghia; ";
      dong.splice(i, 1, hai[0], hai[1]); D.splice(i, 1, _tdbTach(hai[0]), _tdbTach(hai[1])); co = []; chiTuKhoa = []; AA = []; WW = []; i = -1; continue; } }
    AA.push(A); WW.push(Wi);
    for (j = 0; j < D[i].length; j++) if (D[i][j].k != "i") { coT = true; if (D[i][j].k != "w") kw = false; }
    chiTuKhoa.push(coT && kw);
  }
  function chonCo(bao) {   // co tung dong tu be rong (AA: rong tieu de / 1 don vi co, WW: rong phan nghieng)
    co = [];
    for (var k = 0; k < D.length; k++) {
      var v = AA[k] > 0 ? Math.floor((lap * maxW - WW[k]) / AA[k]) : lon;
      v = Math.min(v, chiTuKhoa[k] ? lonNhan : lon);
      if (v < nho) { if (bao) logC += "CANH BAO dong " + (k + 1) + " dai qua (can co " + v + " < " + nho + "): ngat dong lai / giu chu fen + HOI_FEN ban ngan; "; v = nho; }
      co.push(v);
    }
    canCo();
    if (o.co) for (var k2 = 0; k2 < co.length; k2++) if (o.co[k2]) co[k2] = o.co[k2];   // co dat tay theo vai tro (van tu ha neu tran le)
  }
  function canCo() {
    var mn = 9999, k;
    for (k = 0; k < co.length; k++) mn = Math.min(mn, co[k]);
    for (k = 0; k < co.length; k++) co[k] = o.deu ? mn : Math.min(co[k], Math.floor(mn * nhip));
    for (var lan = 0; lan < 2; lan++) for (k = 0; k < co.length; k++) for (var q = 0; q < co.length; q++)
      if (k != q && Math.abs(co[k] - co[q]) <= 0.08 * Math.max(co[k], co[q])) { var m2 = Math.min(co[k], co[q]); co[k] = m2; co[q] = m2; }
  }
  chonCo(false);
  // dung 1 dong o co s, chan chu y, mep trai x0
  function veDong(seg, s, y, n) {
    var ls = [], phai = 0;
    for (var k = 0; k < seg.length; k++) {
      var g2 = seg[k], it = g2.k == "i", sz = it ? ng : s;
      var L = text(g2.t, it ? FS.I : FS.T, sz, g2.k == "v" ? vang : "FFFFFF", 30, y, { name: tenT + " " + n + (g2.k == "w" ? " - t\u1EEB kho\u00E1 tr\u1EAFng" : (it ? " - nghi\u00EAng" : "")) + " - " + g2.t });
      var b = bb(L), trai = x0;
      if (k > 0) { var tr2 = seg[k - 1], gap = g2.sp ? (tr2.k == "i" ? spI : spT * s) : (tr2.k == "i" ? 0.03 * ng : 0.03 * s); trai = phai + gap; }
      L.translate(Math.round(trai - b[0]), 0);
      phai = bb(L)[2]; ls.push(L);
    }
    return ls;
  }
  // do lai o dung co du kien (do o co nho lech ~7% tren Photoshop that) roi chon co lan cuoi
  for (i = 0; i < D.length; i++) if (AA[i] > 0) {
    var ls0 = veDong(D[i], co[i], 700, i + 1), h0 = _tdbHop(ls0);
    AA[i] = Math.max(1, (h0[2] - h0[0]) - WW[i]) / co[i];
    for (j = 0; j < ls0.length; j++) ls0[j].remove();
  }
  chonCo(true);
  function boHet(ds) { for (var a = 0; a < ds.length; a++) for (var c = 0; c < ds[a].length; c++) ds[a][c].remove(); }
  var dongLop = [], S = null, yb = 0;
  function dung() {
    dongLop = []; S = null;
    var prevS = 0;
    for (var k = 0; k < D.length; k++) {
      var s = co[k], ls = null, thu = 0;
      while (true) {
        yb = (k == 0) ? Math.round(top + capR * s) : Math.round(ybTruoc + 0.22 * prevS + (cd - 0.22) * s);
        ls = veDong(D[k], s, yb, k + 1);
        var h = _tdbHop(ls);
        if (h[2] <= x0 + maxW + 1 || thu >= 8) { if (thu >= 8) logC += "CANH BAO dong " + (k + 1) + " van tran le phai; "; break; }
        for (var c = 0; c < ls.length; c++) ls[c].remove();
        s = Math.min(s - 1, Math.floor(s * (maxW - 2) / (h[2] - x0))); thu++;
      }
      if (thu) { co[k] = s; logC += "dong " + (k + 1) + " ha co " + s + " cho vua; "; }
      if (k > 0) {   // dau tieng Viet khong cham dong tren
        var tren = _tdbHop(dongLop[k - 1])[3], duoi = _tdbHop(ls)[1], can = Math.max(8, Math.round(0.08 * s));
        if (duoi - tren < can) { var dd = can - (duoi - tren); for (var c2 = 0; c2 < ls.length; c2++) ls[c2].translate(0, dd); yb += dd; }
      }
      dongLop.push(ls); prevS = s; ybTruoc = yb;
    }
    if (o.duoi) {
      S = text(o.duoi, FS.I, o.duoiCo || 48, "FFFFFF", 30, 760, { name: tenT + " - d\u00F2ng nghi\u00EAng d\u01B0\u1EDBi - " + o.duoi });
      var bs = bb(S), day = _tdbHop(dongLop[dongLop.length - 1])[3];
      S.translate(Math.round(x0 - bs[0]), Math.round(day + (o.duoiCach != null ? o.duoiCach : 26) - bs[1]));
    }
  }
  var ybTruoc = 0;
  dung();
  function tatCa() { var a = []; for (var k = 0; k < dongLop.length; k++) for (var c = 0; c < dongLop[k].length; c++) a.push(dongLop[k][c]); if (S) a.push(S); return a; }
  var box = _tdbHop(tatCa());
  if (o.yMax && box[3] > o.yMax) {
    var f = (o.yMax - top) / (box[3] - top);
    boHet(dongLop); if (S) S.remove();
    for (i = 0; i < co.length; i++) co[i] = Math.max(nho, Math.floor(co[i] * f));
    canCo(); dung(); box = _tdbHop(tatCa());
    logC += (box[3] > o.yMax ? "CANH BAO day chu " + Math.round(box[3]) + " > yMax " + o.yMax + " (de len may): bot dong / doi bo cuc; " : "ha co cho khong de may (yMax " + o.yMax + "); ");
  }
  if (box[1] < 120) logC += "CANH BAO chu cao qua (y " + Math.round(box[1]) + " < 120); ";
  var rong = [];   // do truoc hieu ung (glow lam bb rong them ~30px moi ben)
  for (i = 0; i < dongLop.length; i++) { var hb = _tdbHop(dongLop[i]); rong.push(Math.round(hb[2] - hb[0]) + "(" + Math.round((hb[2] - hb[0]) / maxW * 100) + "%)"); }
  // hieu ung sau cung (do bb truoc khi co glow)
  var all = tatCa();
  for (i = 0; i < D.length; i++) for (j = 0; j < D[i].length; j++) {
    var L2 = dongLop[i][j], k2 = D[i][j].k;
    if (k2 == "v") fxGlow(L2, { glow: { hex: vang, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
    else if (k2 == "w") fxGlow(L2, { glow: { hex: "FFFFFF", op: 30, size: 26 }, shadow: { op: 60, dist: 6, blur: 14 } });
    else fxGlow(L2, { shadow: { op: 78, dist: 3, blur: 8 } });
  }
  if (S) fxGlow(S, { shadow: { op: 78, dist: 3, blur: 8 } });
  if (o.nhom !== false) biaNhom(tenT + " b\u00ECa", all);
  var log = "tieu de bia: co " + co.join("/") + ", x " + Math.round(x0) + ", khoi " + Math.round(box[0]) + "," + Math.round(box[1]) + "," + Math.round(box[2]) + "," + Math.round(box[3]) +
    ", rong " + rong.join(" ") + " / " + Math.round(maxW) + (o.duoi ? ", duoi '" + o.duoi + "'" : "") + (logC ? " | " + logC : "") + "\n";
  return { box: box, co: co, lop: all, log: log };
}

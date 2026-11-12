/* Poly Dung Bai (dung chung) cho Windows - fen 12/11/2026 "có làm link tải exe dc không cho tiện".
   Mo app Poly Dung Bai cua MAY SHOP (may chu) qua link Cloudflare. May nay khong can dang nhap gi:
   lan dau nhap ma 6 so (may shop: "May khac" -> Them may) + ten may, sau do bam la mo.
   Link may shop doi thi hoi link moi (khong hoi lai ma). File tai tu link cua may shop co gan san link (cuoi file).
   Chi dung thu vien co san cua Windows (WinHTTP, hop thoai Win32). Build: packaging/win-chung/build.sh */
#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif
#define _WIN32_WINNT 0x0601
#include <windows.h>
#include <winhttp.h>
#include <shlobj.h>
#include <shobjidl.h>
#include <shlguid.h>
#include <commctrl.h>
#include <stdio.h>
#include <string.h>
#include <wchar.h>

#define TIEU_DE L"Poly Dựng Bài"
#define TEN_LOI_TAT L"Poly Dựng Bài (dùng chung).lnk"

static wchar_t THU_MUC[MAX_PATH], FILE_MAY[MAX_PATH], EXE[MAX_PATH];
static wchar_t URL[600], TOK[160];
static int THU = 0;            /* POLY_THU=1: may thu (wine), tra loi lay tu bien moi truong, cho phep http */

/* ------------------------------------------------------------ chu UTF-8 <-> UTF-16 */
static void u8_w(const char *s, wchar_t *o, int n) { if (!MultiByteToWideChar(CP_UTF8, 0, s, -1, o, n)) o[0] = 0; }
static void w_u8(const wchar_t *s, char *o, int n) { if (!WideCharToMultiByte(CP_UTF8, 0, s, -1, o, n, NULL, NULL)) o[0] = 0; }

static void bao(const wchar_t *m) {
  if (THU) { char b[2048]; w_u8(m, b, sizeof b); printf("BAO: %s\n", b); fflush(stdout); return; }
  MessageBoxW(NULL, m, TIEU_DE, MB_OK | MB_ICONINFORMATION | MB_SETFOREGROUND | MB_TOPMOST);
}

/* ------------------------------------------------------------ hop thoai hoi 1 dong chu (mau hop thoai dung trong bo nho) */
typedef struct { const wchar_t *hoi, *mac_dinh; wchar_t *ra; int n; } Hoi;

static INT_PTR CALLBACK hoi_proc(HWND h, UINT m, WPARAM w, LPARAM l) {
  switch (m) {
  case WM_INITDIALOG: {
    Hoi *c = (Hoi *)l;
    SetWindowLongPtrW(h, GWLP_USERDATA, l);
    SetWindowTextW(h, TIEU_DE);
    SetDlgItemTextW(h, 100, c->hoi);
    SetDlgItemTextW(h, 101, c->mac_dinh ? c->mac_dinh : L"");
    SetForegroundWindow(h);
    SendDlgItemMessageW(h, 101, EM_SETSEL, 0, -1);
    SetFocus(GetDlgItem(h, 101));
    return FALSE;
  }
  case WM_COMMAND:
    if (LOWORD(w) == IDOK) {
      Hoi *c = (Hoi *)GetWindowLongPtrW(h, GWLP_USERDATA);
      GetDlgItemTextW(h, 101, c->ra, c->n);
      EndDialog(h, 1);
      return TRUE;
    }
    if (LOWORD(w) == IDCANCEL) { EndDialog(h, 0); return TRUE; }
    break;
  case WM_CLOSE: EndDialog(h, 0); return TRUE;
  }
  return FALSE;
}

static WORD *canh4(WORD *p) { return (WORD *)(((ULONG_PTR)p + 3) & ~(ULONG_PTR)3); }
static WORD *chu(WORD *p, const wchar_t *s) { while (*s) *p++ = *s++; *p++ = 0; return p; }
static WORD *muc(WORD *p, DWORD style, short x, short y, short cx, short cy, WORD id, WORD lop, const wchar_t *ten) {
  DLGITEMTEMPLATE *t;
  p = canh4(p);
  t = (DLGITEMTEMPLATE *)p;
  t->style = style | WS_CHILD | WS_VISIBLE; t->dwExtendedStyle = 0;
  t->x = x; t->y = y; t->cx = cx; t->cy = cy; t->id = id;
  p = (WORD *)(t + 1);
  *p++ = 0xFFFF; *p++ = lop;
  p = chu(p, ten);
  *p++ = 0;
  return p;
}

/* tra 1 = OK (chu trong ra), 0 = Huy */
static int hoi(const wchar_t *cau, const wchar_t *mac_dinh, wchar_t *ra, int n) {
  if (THU) {   /* may thu: POLY_TRA_LOI = "tra loi 1|tra loi 2|...", lay lan luot; "__HUY__" = bam Huy */
    static wchar_t ds[2048]; static wchar_t *con = NULL; static int nap = 0;
    wchar_t *t; char b[2048];
    w_u8(cau, b, sizeof b); printf("HOI: %s\n", b); fflush(stdout);
    if (!nap) { nap = 1; if (!GetEnvironmentVariableW(L"POLY_TRA_LOI", ds, 2048)) ds[0] = 0; con = ds; }
    if (!con || !*con) return 0;
    t = wcschr(con, L'|');
    if (t) *t = 0;
    lstrcpynW(ra, con, n);
    con = t ? t + 1 : NULL;
    return wcscmp(ra, L"__HUY__") != 0;
  }
  {
    static WORD buf[1024];
    WORD *p = buf;
    DLGTEMPLATE *d = (DLGTEMPLATE *)p;
    Hoi c;
    memset(buf, 0, sizeof buf);
    d->style = DS_MODALFRAME | DS_CENTER | DS_SETFONT | WS_POPUP | WS_CAPTION | WS_SYSMENU | DS_SETFOREGROUND;
    d->cdit = 4; d->x = 0; d->y = 0; d->cx = 280; d->cy = 96;
    p = (WORD *)(d + 1);
    *p++ = 0; *p++ = 0;                 /* khong menu, lop mac dinh */
    p = chu(p, TIEU_DE);
    *p++ = 10;                          /* co chu */
    p = chu(p, L"Segoe UI");
    p = muc(p, SS_LEFT, 8, 8, 264, 36, 100, 0x0082, L"");
    p = muc(p, ES_LEFT | ES_AUTOHSCROLL | WS_BORDER | WS_TABSTOP, 8, 48, 264, 14, 101, 0x0081, L"");
    p = muc(p, BS_DEFPUSHBUTTON | WS_TABSTOP, 160, 72, 54, 16, IDOK, 0x0080, L"OK");
    p = muc(p, BS_PUSHBUTTON | WS_TABSTOP, 218, 72, 54, 16, IDCANCEL, 0x0080, L"Huỷ");
    c.hoi = cau; c.mac_dinh = mac_dinh; c.ra = ra; c.n = n; ra[0] = 0;
    return DialogBoxIndirectParamW(GetModuleHandleW(NULL), (DLGTEMPLATE *)buf, NULL, hoi_proc, (LPARAM)&c) == 1;
  }
}

/* ------------------------------------------------------------ goi may chu (WinHTTP). Tra ma HTTP, 0 = khong mo duoc */
static int http(const wchar_t *phuong_thuc, const wchar_t *url, const char *than, const wchar_t *them, char *ra, int n) {
  URL_COMPONENTS u;
  wchar_t host[300], duong[1200];
  HINTERNET s = NULL, k = NULL, r = NULL;
  DWORD ma = 0, sz = sizeof ma, doc = 0;
  int tong = 0;
  if (ra && n) ra[0] = 0;
  memset(&u, 0, sizeof u);
  u.dwStructSize = sizeof u;
  u.lpszHostName = host; u.dwHostNameLength = 300;
  u.lpszUrlPath = duong; u.dwUrlPathLength = 1200;
  if (!WinHttpCrackUrl(url, 0, 0, &u)) return 0;
  s = WinHttpOpen(L"PolyDungBaiChung/1.0", WINHTTP_ACCESS_TYPE_DEFAULT_PROXY, WINHTTP_NO_PROXY_NAME, WINHTTP_NO_PROXY_BYPASS, 0);
  if (!s) return 0;
  WinHttpSetTimeouts(s, 15000, 15000, 20000, 20000);
  k = WinHttpConnect(s, host, u.nPort, 0);
  if (k) r = WinHttpOpenRequest(k, phuong_thuc, duong[0] ? duong : L"/", NULL, WINHTTP_NO_REFERER, WINHTTP_DEFAULT_ACCEPT_TYPES,
                                u.nScheme == INTERNET_SCHEME_HTTPS ? WINHTTP_FLAG_SECURE : 0);
  if (r && WinHttpSendRequest(r, them ? them : WINHTTP_NO_ADDITIONAL_HEADERS, them ? (DWORD)-1L : 0,
                              (LPVOID)than, than ? (DWORD)strlen(than) : 0, than ? (DWORD)strlen(than) : 0, 0)
        && WinHttpReceiveResponse(r, NULL)) {
    WinHttpQueryHeaders(r, WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER, NULL, &ma, &sz, NULL);
    while (ra && tong < n - 1 && WinHttpReadData(r, ra + tong, n - 1 - tong, &doc) && doc) tong += doc;
    if (ra) ra[tong] = 0;
  }
  if (r) WinHttpCloseHandle(r);
  if (k) WinHttpCloseHandle(k);
  WinHttpCloseHandle(s);
  return (int)ma;
}

/* lay gia tri chuoi "khoa": "..." trong JSON tra ve (khong co dau \" ben trong) */
static int lay_json(const char *j, const char *khoa, char *o, int n) {
  char m[64];
  const char *p, *q;
  int i = 0;
  snprintf(m, sizeof m, "\"%s\"", khoa);
  p = strstr(j, m);
  if (!p) return 0;
  p += strlen(m);
  while (*p == ' ' || *p == ':') p++;
  if (*p != '"') return 0;
  q = ++p;
  while (*q && *q != '"' && i < n - 1) o[i++] = *q++;
  o[i] = 0;
  return i > 0;
}

/* ------------------------------------------------------------ luu link + ma thiet bi */
static void doc_may(void) {
  FILE *f = _wfopen(FILE_MAY, L"rb");
  char d[1024];
  URL[0] = TOK[0] = 0;
  if (!f) return;
  while (fgets(d, sizeof d, f)) {
    d[strcspn(d, "\r\n")] = 0;
    if (!strncmp(d, "url=", 4)) u8_w(d + 4, URL, 600);
    if (!strncmp(d, "token=", 6)) u8_w(d + 6, TOK, 160);
  }
  fclose(f);
}
static void luu_may(void) {
  FILE *f = _wfopen(FILE_MAY, L"wb");
  char a[1300], b[400];
  if (!f) return;
  w_u8(URL, a, sizeof a); w_u8(TOK, b, sizeof b);
  fprintf(f, "url=%s\r\ntoken=%s\r\n", a, b);
  fclose(f);
}

/* link may shop gan o cuoi file .exe khi tai tu link (may chu them "\nPOLYLINK:https://...\n") */
static void link_gan_san(wchar_t *o, int n) {
  HANDLE h = CreateFileW(EXE, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
  char d[700];
  DWORD doc = 0;
  LARGE_INTEGER c;
  o[0] = 0;
  if (h == INVALID_HANDLE_VALUE) return;
  if (GetFileSizeEx(h, &c) && c.QuadPart > 700) {
    LARGE_INTEGER v; v.QuadPart = c.QuadPart - 699;
    SetFilePointerEx(h, v, NULL, FILE_BEGIN);
    if (ReadFile(h, d, 699, &doc, NULL)) {
      char *p, *e;
      d[doc] = 0;
      p = NULL;
      for (e = d; e < d + doc - 10; e++) if (!memcmp(e, "\nPOLYLINK:", 10)) p = e + 10;
      if (p) { e = strchr(p, '\n'); if (e) { *e = 0; u8_w(p, o, n); } }
    }
  }
  CloseHandle(h);
}

/* chi giu https://ten-may: bo khoang trang, duong dan, ?, # */
static void chuan(wchar_t *s) {
  wchar_t t[600], *p;
  int i = 0, j;
  for (p = s; *p && i < 599; p++) if (!iswspace(*p)) t[i++] = *p;
  t[i] = 0;
  p = wcsstr(t, L"://");
  if (p) { p += 3; for (j = 0; p[j]; j++) if (p[j] == L'/' || p[j] == L'?' || p[j] == L'#') { p[j] = 0; break; } }
  lstrcpynW(s, t, 600);
}
static int link_hop_le(const wchar_t *s) {
  if (!wcsncmp(s, L"https://", 8) && wcslen(s) > 12) return 1;
  return THU && !wcsncmp(s, L"http://127.0.0.1", 16);
}

static int thu_vao(void) {   /* 200 = vao duoc, 401 = may bi bo / chua vao, khac = link chet */
  wchar_t u[700], h[260];
  swprintf(u, 700, L"%ls/api/chung/toi", URL);
  swprintf(h, 260, L"X-Poly-Khach: %ls\r\n", TOK);
  return http(L"GET", u, NULL, h, NULL, 0);
}

/* ------------------------------------------------------------ mo app: Chrome (cua so rieng) > Edge > trinh duyet mac dinh */
static int co_file(const wchar_t *p) { DWORD a = GetFileAttributesW(p); return a != INVALID_FILE_ATTRIBUTES && !(a & FILE_ATTRIBUTE_DIRECTORY); }
static void mo_app(void) {
  wchar_t mo[900], tim[MAX_PATH], lenh[2400], g[MAX_PATH];
  const wchar_t *goc[] = {L"ProgramFiles", L"ProgramFiles(x86)", L"LOCALAPPDATA"};
  const wchar_t *duong[] = {L"\\Google\\Chrome\\Application\\chrome.exe", L"\\Microsoft\\Edge\\Application\\msedge.exe"};
  int i, j, co = 0;
  swprintf(mo, 900, L"%ls/#vao=%ls", URL, TOK);
  for (j = 0; j < 2 && !co; j++)
    for (i = 0; i < 3 && !co; i++)
      if (GetEnvironmentVariableW(goc[i], g, MAX_PATH)) { swprintf(tim, MAX_PATH, L"%ls%ls", g, duong[j]); co = co_file(tim); }
  if (THU) {
    char b[2400];
    swprintf(lenh, 2400, L"MO: %ls %ls", co ? tim : L"(mac dinh)", mo);
    w_u8(lenh, b, sizeof b); printf("%s\n", b); fflush(stdout);
    return;
  }
  if (co) {
    STARTUPINFOW si; PROCESS_INFORMATION pi;
    memset(&si, 0, sizeof si); si.cb = sizeof si;
    swprintf(lenh, 2400, L"\"%ls\" --app=\"%ls\" --user-data-dir=\"%ls\\trinh-duyet\" --no-first-run --no-default-browser-check", tim, mo, THU_MUC);
    if (CreateProcessW(tim, lenh, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) { CloseHandle(pi.hThread); CloseHandle(pi.hProcess); return; }
  }
  ShellExecuteW(NULL, L"open", mo, NULL, NULL, SW_SHOWNORMAL);
}

/* lan dau vao duoc: chep app vao %LOCALAPPDATA%\PolyDungBaiChung + loi tat ngoai Desktop */
static void cai_loi_tat(void) {
  wchar_t dich[MAX_PATH], desk[MAX_PATH], lnk[MAX_PATH];
  IShellLinkW *sl = NULL;
  IPersistFile *pf = NULL;
  if (THU) return;
  swprintf(dich, MAX_PATH, L"%ls\\Poly Dung Bai (dung chung).exe", THU_MUC);
  if (lstrcmpiW(dich, EXE)) CopyFileW(EXE, dich, FALSE);
  if (!co_file(dich)) lstrcpynW(dich, EXE, MAX_PATH);
  if (FAILED(SHGetFolderPathW(NULL, CSIDL_DESKTOPDIRECTORY, NULL, 0, desk))) return;
  swprintf(lnk, MAX_PATH, L"%ls\\%ls", desk, TEN_LOI_TAT);
  if (co_file(lnk)) return;
  CoInitialize(NULL);
  if (SUCCEEDED(CoCreateInstance(&CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER, &IID_IShellLinkW, (void **)&sl))) {
    sl->lpVtbl->SetPath(sl, dich);
    sl->lpVtbl->SetWorkingDirectory(sl, THU_MUC);
    sl->lpVtbl->SetIconLocation(sl, dich, 0);
    sl->lpVtbl->SetDescription(sl, L"Mở app Poly Dựng Bài của máy shop");
    if (SUCCEEDED(sl->lpVtbl->QueryInterface(sl, &IID_IPersistFile, (void **)&pf))) { pf->lpVtbl->Save(pf, lnk, TRUE); pf->lpVtbl->Release(pf); }
    sl->lpVtbl->Release(sl);
  }
  CoUninitialize();
}

int WINAPI wWinMain(HINSTANCE hi, HINSTANCE hp, PWSTR cmd, int show) {
  wchar_t x[600], ma[64], ten[120], may[120], gan[600], u[700];
  char than[600], kq[4096], loi[1024], tok8[200], ten8[400], ma8[16];
  int n = 0, c, moi = 0, i, j;
  DWORD sz = 120;
  (void)hi; (void)hp; (void)cmd; (void)show;
  InitCommonControls();
  THU = GetEnvironmentVariableW(L"POLY_THU", x, 8) > 0;
  GetModuleFileNameW(NULL, EXE, MAX_PATH);
  if (!GetEnvironmentVariableW(L"LOCALAPPDATA", x, MAX_PATH)) GetTempPathW(MAX_PATH, x);
  swprintf(THU_MUC, MAX_PATH, L"%ls\\PolyDungBaiChung", x);
  CreateDirectoryW(THU_MUC, NULL);
  swprintf(FILE_MAY, MAX_PATH, L"%ls\\may.txt", THU_MUC);
  doc_may();
  link_gan_san(gan, 600);
  if (!URL[0] && gan[0]) {    /* file tai tu link may shop: thu link gan san truoc, khoi hoi */
    swprintf(u, 700, L"%ls/api/ping", gan);
    if (http(L"GET", u, NULL, NULL, NULL, 0) == 200) lstrcpynW(URL, gan, 600);
  }
  for (;;) {
    if (++n > 8) { bao(L"Chưa vào được app của máy shop. Kiểm tra mạng, hỏi fen máy shop có đang bật “Máy khác” không, rồi mở lại."); return 1; }
    if (!URL[0]) {
      if (!hoi(L"Dán link app của máy shop (fen gửi qua Zalo / Telegram, dạng https://….trycloudflare.com):", gan, x, 600)) return 0;
      chuan(x);
      if (!link_hop_le(x)) { bao(L"Link phải bắt đầu bằng https://"); continue; }
      lstrcpynW(URL, x, 600);
    }
    if (!TOK[0]) {
      if (!hoi(L"Nhập mã 6 số fen đưa (máy shop: Máy khác → Thêm máy):", L"", ma, 64)) return 0;
      if (!GetComputerNameW(may, &sz)) lstrcpyW(may, L"Máy Windows");
      if (!hoi(L"Tên máy này (để fen biết máy nào đang dùng chung):", may, ten, 120)) return 0;
      for (i = j = 0; ma[i] && j < 6; i++) if (ma[i] >= L'0' && ma[i] <= L'9') ma8[j++] = (char)ma[i];
      ma8[j] = 0;
      for (i = j = 0; ten[i]; i++) if (ten[i] >= 32 && ten[i] != L'"' && ten[i] != L'\\') ten[j++] = ten[i];
      ten[j] = 0;
      w_u8(ten, ten8, sizeof ten8);
      snprintf(than, sizeof than, "{\"ma\":\"%s\",\"ten\":\"%s\"}", ma8, ten8);
      swprintf(u, 700, L"%ls/api/chung/vao", URL);
      c = http(L"POST", u, than, L"Content-Type: application/json\r\n", kq, sizeof kq);
      if (c == 200 && lay_json(kq, "token", tok8, sizeof tok8)) { u8_w(tok8, TOK, 160); luu_may(); moi = 1; }
      else if (!c) { bao(L"Không mở được link này. Xem lại link (máy shop khởi động lại thì link đổi)."); URL[0] = 0; continue; }
      else { wchar_t w[1024]; if (lay_json(kq, "err", loi, sizeof loi)) u8_w(loi, w, 1024); else lstrcpyW(w, L"Không vào được, thử lại."); bao(w); continue; }
    }
    c = thu_vao();
    if (c != 200 && c != 401) { Sleep(3000); c = thu_vao(); }
    if (c == 200) break;
    if (c == 401) { TOK[0] = 0; luu_may(); bao(L"Máy này chưa vào hoặc đã bị fen bỏ khỏi dùng chung. Nhập mã mới fen đưa."); continue; }
    if (!hoi(L"Không mở được link cũ (máy shop khởi động lại hoặc mất mạng thì link đổi). Dán link mới bot gửi trong nhóm Telegram, hoặc hỏi fen:", L"", x, 600)) return 0;
    chuan(x);
    if (link_hop_le(x)) { lstrcpynW(URL, x, 600); luu_may(); }
  }
  luu_may();
  if (moi) cai_loi_tat();
  mo_app();
  return 0;
}

/* Poly Dung Bai.exe - mo app Poly Dung Bai (ban cai bang file Setup .exe).
   Chay "app\Poly Dung Bai.vbs" bang wscript: bat may chu nho (Python di kem) neu chua chay, roi mo cua so app bang Edge. */
#include <windows.h>
#include <wchar.h>

int WINAPI wWinMain(HINSTANCE h, HINSTANCE p, PWSTR c, int n) {
  wchar_t dir[MAX_PATH], cmd[MAX_PATH * 2 + 64], vbs[MAX_PATH + 64];
  DWORD k = GetModuleFileNameW(NULL, dir, MAX_PATH);
  if (k == 0 || k >= MAX_PATH) return 1;
  wchar_t *s = wcsrchr(dir, L'\\');
  if (s) *s = 0;
  swprintf(vbs, sizeof(vbs) / sizeof(vbs[0]), L"%ls\\app\\Poly Dung Bai.vbs", dir);
  if (GetFileAttributesW(vbs) == INVALID_FILE_ATTRIBUTES) {
    MessageBoxW(NULL, L"Thi\x1EBFu file app\\Poly Dung Bai.vbs. C\x00E0i l\x1EA1i Poly D\x1EF1ng B\x00E0i.", L"Poly D\x1EF1ng B\x00E0i", MB_ICONERROR);
    return 1;
  }
  swprintf(cmd, sizeof(cmd) / sizeof(cmd[0]), L"wscript.exe //nologo \"%ls\"", vbs);
  STARTUPINFOW si;
  PROCESS_INFORMATION pi;
  ZeroMemory(&si, sizeof(si));
  si.cb = sizeof(si);
  ZeroMemory(&pi, sizeof(pi));
  if (!CreateProcessW(NULL, cmd, NULL, NULL, FALSE, 0, NULL, dir, &si, &pi)) {
    MessageBoxW(NULL, L"Kh\x00F4ng m\x1EDF \x0111\x01B0\x1EE3\x63 Poly D\x1EF1ng B\x00E0i.", L"Poly D\x1EF1ng B\x00E0i", MB_ICONERROR);
    return 1;
  }
  CloseHandle(pi.hProcess);
  CloseHandle(pi.hThread);
  return 0;
}

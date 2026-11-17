/* Photoshop gia cho test bo tu chay (wine): ghi duong dan cua minh vao C:\polythu\ps-mo.txt roi song 60 giay. */
#include <windows.h>
#include <stdio.h>
int WINAPI WinMain(HINSTANCE a, HINSTANCE b, LPSTR c, int d) {
  char p[MAX_PATH]; GetModuleFileNameA(NULL, p, MAX_PATH);
  FILE *f = fopen("C:\\polythu\\ps-mo.txt", "a"); if (f) { fprintf(f, "%s\n", p); fclose(f); }
  Sleep(60000); return 0;
}

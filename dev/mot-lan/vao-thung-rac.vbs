' POLY STORE - dua thu muc vao Thung rac (Recycle Bin), lay lai duoc bang Restore
' fen 20/11 16h35 "xoa het tat ca bai va file sau ngay 18" + 16h38 "may file delete xoa vao thung rac luon di nha cho nhe may"
Option Explicit
Dim fso, sh, rb, ds, p, i, kq, L
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("Shell.Application")
Set rb = sh.NameSpace(10)
ds = Array( _
  "E:\Social Claude\iPad\T11_iPadNaoNhuCauDo_18-11", _
  "E:\Social Claude\iPad\T11_IpadTheoNganh_19-11", _
  "E:\Social Claude\iPad\T11_Top5iPadChoiGame_19-11", _
  "E:\Social Claude\Laptop\T11_MacBookAirM4_18-11", _
  "E:\Social Claude\Laptop\T11_Top5Laptop2026_19-11", _
  "E:\Social Claude\Laptop\T11_Top5LapTrinh_19-11", _
  "E:\Social Claude\Laptop\T11_XepHangMayTram_19-11", _
  "E:\Tool\poly-dung-bai\_to_delete", _
  "E:\Social Claude\_to_delete", _
  "E:\Social Claude\_to_delete-T10_Air4vsAir5_20", _
  "C:\Users\Dao\Pictures\PolySocial\_to_delete")
kq = ""
For Each p In ds
  If fso.FolderExists(p) Then
    rb.MoveHere p, 4
    For i = 1 To 600
      If Not fso.FolderExists(p) Then Exit For
      WScript.Sleep 500
    Next
    If fso.FolderExists(p) Then kq = kq & "CON  " & p & vbCrLf Else kq = kq & "DA VAO THUNG RAC  " & p & vbCrLf
  Else
    kq = kq & "KHONG CO  " & p & vbCrLf
  End If
Next
Set L = fso.CreateTextFile("C:\Users\Dao\Pictures\PolySocial\_tam\thung-rac-kq.txt", True)
L.Write Now & vbCrLf & kq & "XONG" & vbCrLf
L.Close

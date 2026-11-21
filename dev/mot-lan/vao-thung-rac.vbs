' POLY STORE - dua thu muc vao Thung rac (Recycle Bin), lay lai duoc bang Restore
' fen 21/11 11h17 "xoa het may bai nay trong app voi window" (5 bai iPad 03-17/11 + luot app da xoa)
Option Explicit
Dim fso, sh, rb, ds, p, i, kq, L
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("Shell.Application")
Set rb = sh.NameSpace(10)
ds = Array( _
  "E:\Social Claude\iPad\T11_LoiiPadTuSua_17-11", _
  "E:\Social Claude\iPad\T11_ThoiQuenTuongDung_14-11", _
  "E:\Social Claude\iPad\T11_XaiIPadNenTranh_13-11", _
  "E:\Social Claude\iPad\T11_SacKhongVao_11-11", _
  "E:\Social Claude\iPad\T11_DigitalArtist_03-11", _
  "E:\Tool\poly-dung-bai\_to_delete")
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

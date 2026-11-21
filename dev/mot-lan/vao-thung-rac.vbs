' POLY STORE - dua thu muc vao Thung rac (Recycle Bin), lay lai duoc bang Restore
' fen 21/11 11h22 (anh 3 bai Laptop, tiep lenh 11h17 "xoa het may bai nay trong app voi window") + luot app da xoa
Option Explicit
Dim fso, sh, rb, ds, p, i, kq, L
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("Shell.Application")
Set rb = sh.NameSpace(10)
ds = Array( _
  "E:\Social Claude\Laptop\T11_5ThacMacLaptop_17-11", _
  "E:\Social Claude\Laptop\T11_LaptopDungVideo_13-11", _
  "E:\Social Claude\Laptop\T11_LaptopWin10_03-11", _
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

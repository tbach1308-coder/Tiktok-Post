' POLY STORE - dua thu muc vao Thung rac (Recycle Bin), lay lai duoc bang Restore
' fen 21/11 10h42 "xoa may bai con vo thung rac" (7 bai may con phupoly Mac mini 13-17/11 + luot app da xoa)
Option Explicit
Dim fso, sh, rb, ds, p, i, kq, L
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("Shell.Application")
Set rb = sh.NameSpace(10)
ds = Array( _
  "E:\Social Claude\iPad\T11_ProM1vsAirM3_13-11", _
  "E:\Social Claude\iPad\T11_GheNgangPoly_13-11", _
  "E:\Social Claude\iPad\T11_BayMauManiPad_14-11", _
  "E:\Social Claude\iPad\T11_iPadCuBiLua_15-11", _
  "E:\Social Claude\iPad\T11_BaoVeManiPad_15-11", _
  "E:\Social Claude\iPad\T11_IpadProM5_16-11", _
  "E:\Social Claude\iPad\T11_ProAirGenMini_17-11", _
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

' POLY STORE - Bo tu chay script Photoshop (khong can bam).
' Moi 5 giay xem thu muc _tu-chay: co file .jsx thi chuyen sang _da-chay roi bao Photoshop chay (qua COM).
' Bat cung Windows (Startup) + scheduled task 5 phut + khi mo Photoshop. dang-lam.txt chan bat trung khi dang chay script dai.
' 17/11 (fen "fix lai ket noi photoshop"): Photoshop bi tat ma co bai thi Windows khong tu mo duoc qua COM (cho 2 phut roi
'   bao "Object required", bai nao cung loi). Gio: Photoshop dang tat ma co bai -> tu mo Photoshop (thu nho), cho mo xong
'   roi moi chay; mo khong duoc thi ghi LOI ro ly do. dang-chay.txt dong 2: ps=1 (Photoshop dang mo), ps=0 (dang tat,
'   co bai se tu mo), ps=loi (vua tu mo khong duoc) -> app hien dung o o Kiem may.
' 24/11 (fen chon "Giu POLYTool, app tu lo"): tu 19/11 hang cho do POLYTool canh (dang-chay.txt "... polytool pid N").
'   POLYTool dang canh (nhip < 15 phut, ke ca luc dang chay 1 script dai) thi bo nay khong bat; dang chay ma thay POLYTool
'   ghi nhip thi tu tat (23/11 21:15 ca 2 bo cung canh 1 hang). App Poly Dung Bai tu mo Photoshop khi co bai.
' Tham so (chi de thu): /q:<hang cho> /ten:<ten tien trinh> /exe:<duong dan Photoshop.exe> /progid:<COM> /cho:<giay cho mo>
'   /san:<giay cho Photoshop san sang> /nghi:<mili giay giua 2 lan xem> /tuoiloi:<giay> (may khong doc duoc gio sua file, vd wine)
Option Explicit
Dim fso, sh, A, Q, D, lockF, t, f, best, nm, dest, ps, n
Dim PS_TEN, PS_EXE, PROGID, CHO, SAN, NGHI, TUOI_LOI, psTT, moLoiLuc, loiMo, loiNoi, vuaMo, d1
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
Set A = ThamSo()
Q = "C:\Users\Dao\Pictures\PolySocial\_tu-chay"
If A.Exists("q") Then Q = A("q")
PS_TEN = "Photoshop.exe"
If A.Exists("ten") Then PS_TEN = A("ten")
PS_EXE = ""
If A.Exists("exe") Then PS_EXE = A("exe")
PROGID = "Photoshop.Application"
If A.Exists("progid") Then PROGID = A("progid")
CHO = 240
If A.Exists("cho") Then CHO = CLng(A("cho"))
SAN = 30
If A.Exists("san") Then SAN = CLng(A("san"))
NGHI = 5000
If A.Exists("nghi") Then NGHI = CLng(A("nghi"))
TUOI_LOI = -1
If A.Exists("tuoiloi") Then TUOI_LOI = CLng(A("tuoiloi"))
D = Q & "\_da-chay"
lockF = Q & "\dang-chay.txt"
If Not fso.FolderExists(Q) Then fso.CreateFolder Q
If Not fso.FolderExists(D) Then fso.CreateFolder D
' chi chay 1 ban: neu ban khac vua bao song < 20 giay thi thoat
If fso.FileExists(lockF) Then
  If TuoiF(fso.GetFile(lockF)) < 20 Then WScript.Quit
End If
' POLYTool dang canh hang cho (nhip ghi "polytool", con moi < 15 phut) -> khong bat (2 bo cung canh 1 hang thi gianh file)
If PolyTool(900) Then WScript.Quit
' dang chay 1 script dai (Photoshop chua tra ve) thi dang-lam.txt con moi -> khong bat them ban thu 2
If fso.FileExists(Q & "\dang-lam.txt") Then
  If TuoiF(fso.GetFile(Q & "\dang-lam.txt")) < 900 Then WScript.Quit
End If

Sub GhiLog(s)
  Dim L
  Set L = fso.OpenTextFile(Q & "\nhat-ky.txt", 8, True)
  L.WriteLine Now & "  " & s
  L.Close
End Sub

' bao con song (dong 1: gio, dong 2: tinh trang Photoshop); loi ghi file thi bo qua, lan sau ghi lai
' Truoc khi ghi: POLYTool vua ghi nhip (chu "polytool") thi tu tat, khong ghi de len nhip cua POLYTool
Sub Nhip()
  Dim h
  If PolyTool(60) Then
    GhiLog "POLYTOOL DANG CANH HANG CHO - BO TU CHAY CU TU TAT"
    WScript.Quit
  End If
  On Error Resume Next
  Set h = fso.CreateTextFile(lockF, True)
  h.WriteLine Now
  h.WriteLine "ps=" & psTT
  h.Close
  Err.Clear
  On Error GoTo 0
End Sub

' nhip trong dang-chay.txt do POLYTool ghi (co chu "polytool") va con moi hon tuoi giay
Function PolyTool(tuoi)
  Dim h, x
  PolyTool = False
  On Error Resume Next
  If fso.FileExists(lockF) Then
    If TuoiF(fso.GetFile(lockF)) < tuoi Then
      Set h = fso.OpenTextFile(lockF, 1)
      x = h.ReadAll
      h.Close
      If InStr(1, x, "polytool", 1) > 0 Then PolyTool = True
    End If
  End If
  Err.Clear
  On Error GoTo 0
End Function

' Photoshop co dang chay khong (hoi Windows danh sach tien trinh). Khong hoi duoc thi coi nhu dang chay (lam nhu ban cu).
Function PsDangChay()
  Dim c, k
  k = -1
  On Error Resume Next
  Set c = GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT ProcessId FROM Win32_Process WHERE Name='" & PS_TEN & "'")
  If Err.Number = 0 Then k = c.Count
  Err.Clear
  On Error GoTo 0
  PsDangChay = (k <> 0)
End Function

' duong dan Photoshop.exe: tham so /exe, roi App Paths cua Windows, roi ban Photoshop moi nhat trong Program Files\Adobe
Function TimPs()
  Dim p, g, fo, sf, tot
  TimPs = PS_EXE
  If TimPs <> "" Then Exit Function
  p = ""
  On Error Resume Next
  p = sh.RegRead("HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\Photoshop.exe\")
  Err.Clear
  On Error GoTo 0
  p = Trim(Replace(p & "", """", ""))
  If p <> "" Then
    If fso.FileExists(p) Then
      TimPs = p
      Exit Function
    End If
  End If
  tot = ""
  g = Replace(sh.ExpandEnvironmentStrings("%ProgramFiles%"), Chr(0), "") & "\Adobe"
  If fso.FolderExists(g) Then
    Set fo = fso.GetFolder(g)
    For Each sf In fo.SubFolders
      If LCase(Left(sf.Name, 16)) = "adobe photoshop " And fso.FileExists(sf.Path & "\Photoshop.exe") Then
        If tot = "" Then
          tot = sf.Path
        ElseIf LCase(sf.Name) > LCase(fso.GetFileName(tot)) Then
          tot = sf.Path
        End If
      End If
    Next
  End If
  If tot <> "" Then TimPs = tot & "\Photoshop.exe"
End Function

' Photoshop dang tat ma co bai: tu mo (thu nho, khong chiem man hinh), cho tien trinh len + SAN giay cho mo xong.
' Tra True khi Photoshop da mo; False thi ly do o loiMo.
Function MoPs()
  Dim exe, i, thay
  MoPs = False
  vuaMo = False
  If PsDangChay() Then
    MoPs = True
    Exit Function
  End If
  exe = TimPs()
  If exe = "" Then
    loiMo = "khong thay Photoshop.exe tren may"
    Exit Function
  End If
  If Not fso.FileExists(exe) Then
    loiMo = "khong thay " & exe
    Exit Function
  End If
  GhiLog "PHOTOSHOP DANG TAT - TU MO  " & exe
  On Error Resume Next
  sh.Run """" & exe & """", 7, False
  If Err.Number <> 0 Then
    loiMo = "khong mo duoc Photoshop: " & Err.Description
    Err.Clear
    On Error GoTo 0
    Exit Function
  End If
  On Error GoTo 0
  vuaMo = True
  thay = -1
  For i = 1 To CHO
    Ngu 1000
    If i Mod 5 = 0 Then Nhip
    If thay < 0 Then
      If PsDangChay() Then thay = i
    End If
    If thay >= 0 Then
      If i - thay >= SAN Then
        GhiLog "PHOTOSHOP DA MO (" & i & " giay)"
        MoPs = True
        Exit Function
      End If
    End If
  Next
  If thay >= 0 Then
    MoPs = True
  Else
    loiMo = "da mo Photoshop nhung cho " & CHO & " giay chua thay len (hop thoai dang nhap / cap nhat Adobe?)"
  End If
End Function

' noi COM toi Photoshop; khong noi duoc thi tra Nothing, ly do o loiNoi
Function NoiPs()
  Dim o
  Set o = Nothing
  On Error Resume Next
  Set o = CreateObject(PROGID)
  If Err.Number <> 0 Then
    loiNoi = Err.Description
    If loiNoi = "" Then loiNoi = "ma loi &H" & Hex(Err.Number)
    Set o = Nothing
  End If
  Err.Clear
  On Error GoTo 0
  Set NoiPs = o
End Function

psTT = "1"
If Not PsDangChay() Then psTT = "0"
moLoiLuc = Now - 1
GhiLog "BO TU CHAY DA BAT"
Do
  If PolyTool(60) Then
    GhiLog "POLYTOOL DANG CANH HANG CHO - BO TU CHAY CU TU TAT"
    WScript.Quit
  End If
  If PsDangChay() Then
    psTT = "1"
  ElseIf psTT = "loi" And Giay(moLoiLuc) < 600 Then
    psTT = "loi"
  Else
    psTT = "0"
  End If
  Nhip
  Set best = Nothing
  For Each f In fso.GetFolder(Q).Files
    If LCase(fso.GetExtensionName(f.Name)) = "jsx" Then
      If TuoiF(f) >= 3 Then
        If best Is Nothing Then
          Set best = f
        ElseIf f.DateLastModified < best.DateLastModified Then
          Set best = f
        End If
      End If
    End If
  Next
  If Not best Is Nothing Then
    nm = best.Name
    vuaMo = False
    loiMo = ""
    If psTT <> "1" Then
      If Giay(moLoiLuc) < 120 Then
        ' vua tu mo khong duoc (< 2 phut): khong mo lai lien tuc, bao loi ngay
        loiMo = "Photoshop dang tat, vua tu mo khong duoc - fen mo Photoshop giup"
      ElseIf MoPs() Then
        psTT = "1"
      Else
        psTT = "loi"
        moLoiLuc = Now
        GhiLog "KHONG TU MO DUOC PHOTOSHOP: " & loiMo
        loiMo = "Photoshop dang tat, tu mo khong duoc (" & loiMo & ") - fen mo Photoshop giup"
      End If
      Nhip
    End If
    n = Year(Now) & Right("0" & Month(Now), 2) & Right("0" & Day(Now), 2) & "-" & Right("0" & Hour(Now), 2) & Right("0" & Minute(Now), 2) & Right("0" & Second(Now), 2)
    dest = D & "\" & n & "-" & nm
    fso.MoveFile best.Path, dest
    GhiLog "BAT DAU  " & nm
    If psTT <> "1" Then
      GhiLog "LOI  " & nm & "  " & loiMo
    Else
      Set t = fso.CreateTextFile(Q & "\dang-lam.txt", True): t.WriteLine Now & "  " & nm: t.Close
      Set ps = NoiPs()
      If ps Is Nothing And vuaMo Then
        ' Photoshop vua mo, chua nhan lenh: cho them roi noi lai (chua chay gi nen noi lai khong sao)
        Ngu SAN * 1000
        Set ps = NoiPs()
      End If
      If ps Is Nothing Then
        GhiLog "LOI  " & nm & "  khong noi duoc Photoshop: " & loiNoi
      Else
        On Error Resume Next
        ps.DoJavaScriptFile dest
        If Err.Number <> 0 Then
          d1 = Err.Description
          If d1 = "" Then d1 = "Photoshop bao loi ma &H" & Hex(Err.Number) & " (hop thoai dang mo? Photoshop vua bi tat?)"
          Err.Clear
          On Error GoTo 0
          GhiLog "LOI  " & nm & "  " & d1
        Else
          On Error GoTo 0
          GhiLog "XONG  " & nm
        End If
      End If
      Set ps = Nothing
      On Error Resume Next
      If fso.FileExists(Q & "\dang-lam.txt") Then fso.DeleteFile Q & "\dang-lam.txt"
      Err.Clear
      On Error GoTo 0
    End If
  End If
  Ngu NGHI
Loop

' tham so dang /ten:gia tri (tu doc WScript.Arguments: WScript.Arguments.Named khong co o moi noi)
Function ThamSo()
  Dim d, x, i, j
  Set d = CreateObject("Scripting.Dictionary")
  d.CompareMode = 1
  For j = 0 To WScript.Arguments.Count - 1
    x = WScript.Arguments(j)
    i = InStr(x, ":")
    If Left(x, 1) = "/" And i > 2 Then d(LCase(Mid(x, 2, i - 2))) = Mid(x, i + 1)
  Next
  Set ThamSo = d
End Function

' so giay tu luc t toi gio (ngay gio trong VBScript la so ngay)
Function Giay(t)
  Giay = (Now - t) * 86400
End Function

' so giay tu lan sua cuoi cua file (doi tuong File); khong doc duoc gio sua thi tra TUOI_LOI
Function TuoiF(fo)
  Dim x
  x = TUOI_LOI
  On Error Resume Next
  x = Giay(fo.DateLastModified)
  Err.Clear
  On Error GoTo 0
  TuoiF = x
End Function

' nghi ms mili giay (may khong co WScript.Sleep, vd wine: cho bang dong ho)
Sub Ngu(ms)
  Dim t0
  On Error Resume Next
  WScript.Sleep ms
  If Err.Number <> 0 Then
    Err.Clear
    t0 = Timer
    Do While Timer - t0 < ms / 1000 And Timer >= t0
    Loop
  End If
  On Error GoTo 0
End Sub

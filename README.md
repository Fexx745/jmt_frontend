Function AutoIDPettyCash()
    Dim MM, YY, TmpIDAutoPetty, TmpIDPetty As String

    MM = ""
    YY = ""
    TmpIDAutoPetty = ""
    TmpIDPetty = ""

    'ประกาศตัวแปรเพื่อรับวันที่จาก Server
    Dim comDate As New System.Data.SqlClient.SqlCommand("SELECT getDate()", con)
    DateServer = comDate.ExecuteScalar()

    'เก็บเดือนและปี ปัจจุบันจาก Server
    MM = Month(DateServer)
    YY = Year(DateServer)

    'เติม 0 ข้างหน้าเดือนให้ครบ 2 หลัก เช่น 01, 02, ..., 12
    While Len(MM) < 2
        MM = "0" + MM
    End While

    'ตรวจสอบว่ามีเลข ID เดิมในเดือนและปีนี้หรือไม่
    Dim comID As New System.Data.SqlClient.SqlCommand("SELECT ID_PettyCash FROM tbl_PettyCash WHERE ID_PettyCash like '%" & YY & MM & "%'", con)
    Dim ResultID As Object = comID.ExecuteScalar

    If (ResultID Is Nothing) Or (ResultID Is DBNull.Value) Then
        TmpIDPetty = "0000" 'ถ้ายังไม่มีให้เริ่มที่ 0000
    Else
        'ถ้ามีแล้วให้ดึงเลขล่าสุดออกมา
        Dim com As New System.Data.SqlClient.SqlCommand("SELECT MAX(RIGHT(ID_PettyCash,10)) FROM tbl_PettyCash", con)
        TmpIDPetty = com.ExecuteScalar()
    End If

    'เพิ่มค่าเลขท้าย ID
    TmpIDPetty = Right(TmpIDPetty, 4)
    TmpIDPetty = TmpIDPetty + 1

    'เติม 0 ข้างหน้าเลขท้าย ID ให้ครบ 4 หลัก
    While Len(TmpIDPetty) < 4
        TmpIDPetty = "0" + TmpIDPetty
    End While

    'รวมปี + เดือน + เลข ID 4 หลัก
    TmpIDAutoPetty = YY & MM & TmpIDPetty

    'คืนค่า ID อัตโนมัติ
    Return TmpIDAutoPetty
End Function

สรุป:
1:1 Relationship: PettyCash มีความสัมพันธ์กับ Date เพื่อกำหนดรหัส ID_PettyCash โดยใช้เดือนและปี

1:M Relationship: 1 เดือนและปี (Date) สามารถมีหลายการเบิกจ่าย (หลาย ID_PettyCash) โดยแต่ละการเบิกจ่ายจะมี TmpIDPetty ที่เพิ่มขึ้น
window.onload = function () {
    
    const ADMIN_PASSWORD = "20011379";

let savedPassword = localStorage.getItem("adminPassword");

if(!savedPassword){

    localStorage.setItem("adminPassword",ADMIN_PASSWORD);

    savedPassword = ADMIN_PASSWORD;

}

let input = prompt("رمز ورود را وارد کنید");

if(input===null){

    document.body.innerHTML="<h2 style='text-align:center;margin-top:100px'>ورود لغو شد</h2>";

    return;

}

if(input!==savedPassword){

    alert("رمز اشتباه است");

    document.body.innerHTML="<h2 style='text-align:center;margin-top:100px;color:red'>دسترسی غیرمجاز</h2>";

    return;

}

let employees = JSON.parse(localStorage.getItem("employees")) || [];

let progress = JSON.parse(localStorage.getItem("progress")) || {};

const table = document.getElementById("employees");
const addBtn = document.getElementById("addBtn");
const nameInput = document.getElementById("name");
const codeInput = document.getElementById("code");
const jobInput = document.getElementById("job");
const phoneInput = document.getElementById("phone");
const searchInput = document.getElementById("search");
const exportBtn = document.getElementById("exportBtn");
const driverReportBtn = document.getElementById("driverReportBtn");
const monthlyReportBtn = document.getElementById("monthlyReportBtn");
const workDate = document.getElementById("workDate");
const pdfReportBtn = document.getElementById("pdfReportBtn");
const backupBtn = document.getElementById("backupBtn");
const restoreBtn = document.getElementById("restoreBtn");
const restoreFile = document.getElementById("restoreFile");
const imageReportBtn = document.getElementById("imageReportBtn");
const reportArea = document.getElementById("reportArea");
const mainMeter = document.getElementById("mainMeter");
const secondaryMeter = document.getElementById("secondaryMeter");
const powerMeter = document.getElementById("powerMeter");
const lightingMeter = document.getElementById("lightingMeter");
const pjbMeter = document.getElementById("pjbMeter");
const saveProgressBtn = document.getElementById("saveProgressBtn");
const monthlyMeterBtn =
document.getElementById("monthlyMeterBtn");

function saveData(){
    localStorage.setItem("employees", JSON.stringify(employees));
}

function render(){

    table.innerHTML="";

    let keyword = searchInput.value.toLowerCase();

let present=0;
let absent=0;
let leave=0;
let mission=0;
let totalWork = 0;

    employees.forEach((emp,index)=>{

        if(!emp.name.toLowerCase().includes(keyword)) return;
        
let status = "حاضر";

if (
    workDate.value &&
    emp.records[workDate.value] &&
    emp.records[workDate.value].status
) {
    status = emp.records[workDate.value].status;
}
        
let workValue = 0;

switch(status){

case "حاضر":
    present++;
    workValue = 1;
    break;

case "دوبله":
    present += 2;
    workValue = 2;
    break;

case "غایب":
    absent++;
    workValue = 0;
    break;

case "مرخصی":
    leave++;
    workValue = 0;
    break;

case "ماموریت":
    mission++;
    workValue = 1;
    break;

}

totalWork += workValue;

        table.innerHTML += `
        <tr>

        <td>${index+1}</td>

        <td>${emp.code}</td>

<td>${emp.name}</td>

<td>${emp.job}</td>

<td>${emp.phone}</td>

        <td>

        <select onchange="changeStatus(${index},this.value)">

        <option ${status=="حاضر"?"selected":""}>حاضر</option>
        
        <option ${status=="دوبله"?"selected":""}>دوبله</option>

        <option ${status=="غایب"?"selected":""}>غایب</option>

        <option ${status=="مرخصی"?"selected":""}>مرخصی</option>

        <option ${status=="ماموریت"?"selected":""}>ماموریت</option>

        </select>

        </td>
        
        <td>
<input
type="checkbox"
${emp.records[workDate.value]?.driver ? "checked" : ""}
onchange="changeDriver(${index}, this.checked)">
</td>
        
        <td>${workValue}</td>

        <td>

        <button onclick="editEmployee(${index})">ویرایش</button>

        <button onclick="deleteEmployee(${index})">حذف</button>

        </td>

        </tr>

        `;

    });
    
document.getElementById("total").textContent = employees.length;
document.getElementById("present").textContent = present;
document.getElementById("absent").textContent = absent;
document.getElementById("leave").textContent = leave;
document.getElementById("mission").textContent = mission;
document.getElementById("totalWork").textContent = totalWork;

}

window.changeStatus=function(index,status){

    if(workDate.value==""){
        alert("ابتدا تاریخ را انتخاب کنید");
        return;
    }

    if(!employees[index].records[workDate.value]){
    employees[index].records[workDate.value]={};
}

employees[index].records[workDate.value].status = status;

    saveData();

    render();

}

window.changeDriver = function(index, value){

    if(workDate.value==""){
        alert("ابتدا تاریخ را انتخاب کنید");
        return;
    }

    if(!employees[index].records[workDate.value]){
        employees[index].records[workDate.value] = {};
    }

    employees[index].records[workDate.value].driver = value;

    saveData();

    render();

}

window.deleteEmployee=function(index){

if(confirm("حذف شود؟")){

employees.splice(index,1);

saveData();

render();

}

}

window.editEmployee = function(index){

let emp = employees[index];

let code = prompt("کد پرسنلی", emp.code);

if(code===null) return;

let name = prompt("نام پرسنل", emp.name);

if(name===null) return;

let job = prompt("سمت", emp.job);

if(job===null) return;

let phone = prompt("شماره تماس", emp.phone);

if(phone===null) return;

emp.code = code.trim();

emp.name = name.trim();

emp.job = job.trim();

emp.phone = phone.trim();

saveData();

render();

}

addBtn.onclick=function(){

let name=nameInput.value.trim();

if(name==""){

alert("نام را وارد کنید");

return;

}

employees.push({

id: Date.now(),

code: codeInput.value.trim(),

name: nameInput.value.trim(),

job: jobInput.value.trim(),

phone: phoneInput.value.trim(),

records:{}

});

codeInput.value="";
nameInput.value="";
jobInput.value="";
phoneInput.value="";

saveData();

render();

}

searchInput.onkeyup=render;

exportBtn.onclick=function(){

if(workDate.value==""){

alert("ابتدا تاریخ را انتخاب کنید");

return;

}

let csv="کد,نام,سمت,تلفن,وضعیت\n";

employees.forEach(emp=>{

let status = "";

if (
    emp.records[workDate.value] &&
    emp.records[workDate.value].status
) {
    status = emp.records[workDate.value].status;
}

csv+=`${emp.code},${emp.name},${emp.job},${emp.phone},${status}\n`;
});

let blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});

let link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="attendance.csv";

link.click();

}

driverReportBtn.onclick = function(){

    let report = "گزارش رانندگان سرویس\n\n";

    employees.forEach(emp=>{

        let count = 0;

        for(let date in emp.records){
            
            // فقط ماه انتخاب شده
if(workDate.value==""){

alert("ابتدا ماه را انتخاب کنید");

return;

}

let selectedMonth = workDate.value.substring(0,7);

if(date.substring(0,7) != selectedMonth){

continue;

}

            if(emp.records[date].driver){
                count++;
            }

        }

        report += `${emp.name} : ${count} روز\n`;

    });

    alert(report);

}

monthlyReportBtn.onclick = function(){

    let report = "گزارش ماهانه\n\n";

    employees.forEach(emp=>{

        let present = 0;
        let double = 0;
        let absent = 0;
        let leave = 0;
        let mission = 0;
        let driver = 0;
        let work = 0;

        for(let date in emp.records){
            
            // فقط ماه انتخاب شده
if(workDate.value==""){

alert("ابتدا ماه را انتخاب کنید");

return;

}

let selectedMonth = workDate.value.substring(0,7);

if(date.substring(0,7) != selectedMonth){

continue;

}

            let rec = emp.records[date];

            switch(rec.status){

                case "حاضر":
                    present++;
                    work += 1;
                    break;

                case "دوبله":
                    double++;
                    work += 2;
                    break;

                case "غایب":
                    absent++;
                    break;

                case "مرخصی":
                    leave++;
                    break;

                case "ماموریت":
                    mission++;
                    work += 1;
                    break;

            }

            if(rec.driver){
                driver++;
            }

        }

        report +=
`نام: ${emp.name}
حاضر: ${present}
دوبله: ${double}
ماموریت: ${mission}
مرخصی: ${leave}
غایب: ${absent}
راننده: ${driver}
کارکرد: ${work}

---------------------

`;

    });

    alert(report);

}

pdfReportBtn.onclick = function(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text("Attendance Report",20,20);

    doc.save("attendance.pdf");

}

backupBtn.onclick = function(){

    let data = JSON.stringify(employees,null,2);

    let blob = new Blob([data],{
        type:"application/json"
    });

    let link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="attendance-backup.json";

    link.click();

}

restoreBtn.onclick=function(){

    restoreFile.click();

}

restoreFile.onchange=function(e){

    let file=e.target.files[0];

    if(!file) return;

    let reader=new FileReader();

    reader.onload=function(){

        employees=JSON.parse(reader.result);

        saveData();

        render();

        alert("اطلاعات با موفقیت بازیابی شد.");

    }

    reader.readAsText(file);

}

function getPersianMonth(date){

    if(!date) return "انتخاب نشده";

    // تبدیل اعداد فارسی به انگلیسی
    date = date.replace(/[۰-۹]/g, function(d){
        return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
    });

    const months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند"
    ];

    let parts = date.split("/");

    let year = parts[0];
    let month = parseInt(parts[1],10);

    return months[month-1] + " " + year;

}

imageReportBtn.onclick = function(){

let html = `

<div style="
width:100%;
background:#fff;
padding:30px;
font-family:tahoma;
direction:rtl;
color:#000;
">

<h1 style="
text-align:center;
margin:0;
font-size:30px;
font-weight:bold;
">
شرکت مبین شکوه پارس
</h1>

<h2 style="
text-align:center;
margin-top:10px;
margin-bottom:25px;
">
گزارش ماهانه حضور و غیاب پرسنل
</h2>

<table style="
width:100%;
border-collapse:collapse;
margin-bottom:25px;
font-size:17px;
">

<tr>

<td style="padding:8px;">
<b>نام پروژه :</b> کابل کشی
</td>

<td style="padding:8px;">
<b>ماه گزارش :</b>
${getPersianMonth(workDate.value)}
</td>

</tr>

<tr>

<td style="padding:8px;">
<b>پیمانکار پروژه :</b> ابراهیم عثمانی
</td>

<td style="padding:8px;">
<b>مدیر پروژه :</b> محمد حسین ثامری
</td>

</tr>

</table>

<hr style="margin-bottom:20px;">

<table border="1"
style="
width:100%;
border-collapse:collapse;
text-align:center;
font-size:15px;
">

<tr style="
background:#1f4e78;
color:white;
">

<th>ردیف</th>

<th>کد</th>

<th>نام</th>

<th>حاضر</th>

<th>دوبله</th>

<th>ماموریت</th>

<th>مرخصی</th>

<th>غایب</th>

<th>راننده</th>

<th>کارکرد</th>

</tr>
`;

employees.forEach((emp,index)=>{

let present=0;
let absent=0;
let leave=0;
let mission=0;
let double=0;
let driver=0;
let work=0;

for(let date in emp.records){
    
    // فقط ماه انتخاب شده
if(workDate.value==""){

alert("ابتدا ماه را انتخاب کنید");

return;

}

let selectedMonth = workDate.value.substring(0,7);

if(date.substring(0,7) != selectedMonth){

continue;

}

let rec=emp.records[date];

switch(rec.status){

case "حاضر":
present++;
work++;
break;

case "دوبله":
double++;
work+=2;
break;

case "ماموریت":
mission++;
work++;
break;

case "مرخصی":
leave++;
break;

case "غایب":
absent++;
break;

}

if(rec.driver){
driver++;
}

}

html+=`

<tr>

<td>${index+1}</td>

<td>${emp.code}</td>

<td>${emp.name}</td>

<td>${present}</td>

<td>${double}</td>

<td>${mission}</td>

<td>${leave}</td>

<td>${absent}</td>

<td>${driver}</td>

<td>${work}</td>

</tr>

`;

});

html+=`

</table>

<br><br>

<div style="display:flex;justify-content:space-between;font-size:18px;">

<div>

امضاء پیمانکار ابراهیم عثمانی

</div>

<div>

امضاء مدیر پروژه 
محمد حسین ثامری

</div>

</div>

</div>

`;

reportArea.innerHTML = html;

reportArea.style.cssText = `
display:block;
width:794px;
min-height:1123px;
background:#ffffff;
padding:40px;
margin:auto;
direction:rtl;
font-family:tahoma;
color:#000;
border:3px solid #000;
box-sizing:border-box;
`;

html2canvas(reportArea,{
scale:5,
useCORS:true,
backgroundColor:"#ffffff",
}).then(function(canvas){

    let image = canvas.toDataURL("image/png");

    let link = document.createElement("a");

    link.href = image;

    link.download = "گزارش_ماهانه.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});

}

function toEnglishDigits(str){
    return str.replace(/[۰-۹]/g, function(d){
        return "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)];
    });
}

saveProgressBtn.onclick = function(){
    
    alert("تاریخ: " + workDate.value);
    
    console.log("Save Clicked");
console.log("Date:", workDate.value);

    if(workDate.value==""){
        alert("ابتدا تاریخ را انتخاب کنید");
        return;
    }

    let dateKey = toEnglishDigits(workDate.value);

progress[dateKey] = {
        main: Number(mainMeter.value),

        secondary: Number(secondaryMeter.value),

        power: Number(powerMeter.value),

        lighting: Number(lightingMeter.value),

        pjb: Number(pjbMeter.value)

    };

    localStorage.setItem("progress", JSON.stringify(progress));

loadProgress();

alert("پیشرفت روزانه ذخیره شد");

render();
}

function loadProgress(){

    if(workDate.value=="") return;

    let dateKey = toEnglishDigits(workDate.value);

let p = progress[dateKey];

    if(!p){

        mainMeter.value = 0;
        secondaryMeter.value = 0;
        powerMeter.value = 0;
        lightingMeter.value = 0;
        pjbMeter.value = 0;

        return;

    }

    mainMeter.value = p.main || 0;
    secondaryMeter.value = p.secondary || 0;
    powerMeter.value = p.power || 0;
    lightingMeter.value = p.lighting || 0;
    pjbMeter.value = p.pjb || 0;

}

$("#workDate").persianDatepicker({

    format: "YYYY/MM/DD",

    autoClose: true,

    initialValue: false,

    onSelect:function(){

        render();

        loadProgress();

    }

});

function monthlyMeters(){

    if(workDate.value=="") return;

    let selectedMonth = workDate.value.substring(0,7);

    let main=0;
    let secondary=0;
    let power=0;
    let lighting=0;
    let pjb=0;

    for(let date in progress){

        if(date.substring(0,7)!=selectedMonth) continue;

        main += progress[date].main || 0;
        secondary += progress[date].secondary || 0;
        power += progress[date].power || 0;
        lighting += progress[date].lighting || 0;
        pjb += progress[date].pjb || 0;

    }

    let total =
    main+
    secondary+
    power+
    lighting+
    pjb;

    alert(
`گزارش متراژ ماه

Main : ${main} متر

Secondary : ${secondary} متر

Power : ${power} متر

Lighting : ${lighting} متر

PJB : ${pjb} متر

--------------------

جمع کل : ${total} متر`
    );

}

monthlyMeterBtn.onclick=function(){

    monthlyMeters();

}

render();

loadProgress();

}
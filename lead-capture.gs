const SPREADSHEET_ID = '1Z8Z4W7idnLc5K5tWwfZVeIjwLFBtz5ADSNaU3T_1aZw';
const TAB = 'Website Leads';
const HEADERS = ['Received at (IST)','Lead ID','Name','Phone','Requirement','Location','Property type','Budget / expected value','Message','Consent','Source','Referrer','Campaign parameters','Status'];
function setup(){
  const book=SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet=book.getSheetByName(TAB);
  if(!sheet)sheet=book.insertSheet(TAB);
  if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#102f50').setFontColor('#ffffff');sheet.autoResizeColumns(1,HEADERS.length);}
  if(sheet.getRange(1,1,1,HEADERS.length).getValues()[0].join('|')!==HEADERS.join('|'))throw new Error('Unexpected headers in Website Leads. No data changed.');
  return sheet;
}
function doPost(e){
  const p=e && e.parameter || {};let ok=false;const lock=LockService.getScriptLock();
  try{
    if(p.website || p.consent!=='Yes' || !/^[6-9]\d{9}$/.test(p.phone||'') || !/^[a-f0-9-]{36}$/.test(p.id||'') || !['Purchase','Sale','Rent','Collaboration'].includes(p.requirement) || !String(p.name||'').trim() || !String(p.location||'').trim())throw new Error('Invalid enquiry');
    lock.waitLock(15000);const sheet=setup();
    const existing=sheet.getLastRow()>1 && sheet.getRange(2,2,sheet.getLastRow()-1,1).createTextFinder(p.id).matchEntireCell(true).findNext();
    if(!existing){
      const clean=(v,max)=>{let s=String(v||'').trim().slice(0,max);return /^[=+@-]/.test(s)?"'"+s:s;};
      sheet.appendRow([Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd HH:mm:ss'),p.id,clean(p.name,100),"'"+p.phone,p.requirement,clean(p.location,150),clean(p.propertyType,100),clean(p.budget,100),clean(p.message,1000),'Yes',clean(p.source,500),clean(p.referrer,500),clean(p.utm,1000),'New']);
      SpreadsheetApp.flush();
    }ok=true;
  }catch(error){console.error(String(error));}finally{if(lock.hasLock())lock.releaseLock();}
  const result=JSON.stringify({type:'mahadev-lead',id:String(p.id||''),ok}).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.top.postMessage('+result+',"*");</script></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const menu=document.getElementById('menu'),nav=document.getElementById('navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const form=document.getElementById('lead-form'),status=document.getElementById('form-status'),submit=document.getElementById('submit'),fallback=document.getElementById('whatsapp-fallback');
if(form.dataset.defaultRequirement)form.elements.requirement.value=form.dataset.defaultRequirement;
document.querySelectorAll('[data-requirement]').forEach(a=>a.addEventListener('click',()=>{form.elements.requirement.value=a.dataset.requirement;}));
let pending=null,leadId=null,fingerprint='';
function collect(){
 if(!form.reportValidity())return null;
 const fields=Object.fromEntries(new FormData(form));
 fields.phone=fields.phone.replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'');
 if(!/^[6-9]\d{9}$/.test(fields.phone)){status.textContent='Please enter a valid Indian mobile number (10 digits, optionally with +91).';form.elements.phone.focus();return null;}
 return fields;
}
function whatsappUrl(fields){
 const labels={name:'Name',phone:'Mobile',requirement:'Requirement',location:'Location',propertyType:'Property type',budget:'Budget / expected value',message:'Additional details'};
 const lines=['Hello Mahadev Properties,','I would like to discuss a property requirement.','',...Object.entries(labels).map(([key,label])=>`${label}: ${fields[key]||'Not specified'}`)];
 return 'https://wa.me/918920030789?text='+encodeURIComponent(lines.join('\n'));
}
document.getElementById('send-whatsapp').addEventListener('click',()=>{
 const fields=collect();if(!fields)return;
 window.open(whatsappUrl(fields),'_blank','noopener,noreferrer');
 status.textContent='WhatsApp opened with your details. Tap Send in WhatsApp to deliver your message. This button does not save a Google Sheet entry.';
});
window.addEventListener('message',event=>{
 if(!pending || (!['https://script.google.com','https://script.googleusercontent.com'].includes(event.origin)&&!/^https:\/\/[a-z0-9-]+[.-]script\.googleusercontent\.com$/.test(event.origin)))return;
 if(event.data?.type!=='mahadev-lead'||event.data.id!==pending.id)return;
 clearTimeout(pending.timer);pending.frame.remove();pending=null;submit.disabled=false;
 status.textContent=event.data.ok?'Thank you. Your enquiry has been saved. You can also send these details using the WhatsApp button.':'Your enquiry could not be saved. Please retry or send your details on WhatsApp.';
 fallback.hidden=!!event.data.ok;
});
form.addEventListener('submit',event=>{
 event.preventDefault();if(pending)return;
 const fields=collect();if(!fields)return;
 fallback.href=whatsappUrl(fields);
 const endpoint=window.MAHADEV_CONFIG?.leadEndpoint;
 if(!endpoint||!/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(endpoint)){status.textContent='We could not save your enquiry online. Please use “Send details on WhatsApp” to contact our team.';fallback.hidden=true;return;}
 const current=JSON.stringify(fields);if(current!==fingerprint){leadId=crypto.randomUUID();fingerprint=current;}
 fields.id=leadId;fields.consent='Yes';fields.source=location.origin+location.pathname;fields.referrer=document.referrer;fields.utm=new URLSearchParams(location.search).toString().slice(0,1000);
 const frame=document.createElement('iframe');frame.name='lead-'+fields.id;frame.hidden=true;frame.title='Enquiry submission';document.body.append(frame);
 const post=document.createElement('form');post.method='POST';post.action=endpoint;post.target=frame.name;post.hidden=true;
 Object.entries(fields).forEach(([key,value])=>{const input=document.createElement('input');input.name=key;input.value=value;post.append(input);});
 document.body.append(post);submit.disabled=true;status.textContent='Saving your enquiry…';fallback.hidden=true;
 pending={id:fields.id,frame,timer:setTimeout(()=>{frame.remove();pending=null;submit.disabled=false;status.textContent='We could not confirm that your enquiry was saved. Retry with the same details or contact us on WhatsApp.';fallback.hidden=false;},25000)};
 post.submit();post.remove();
});


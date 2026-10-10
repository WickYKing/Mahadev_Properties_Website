'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const menu = document.getElementById('menu');
const nav = document.getElementById('navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }));
const form = document.getElementById('lead-form');
if (form.dataset.defaultRequirement) form.elements.requirement.value = form.dataset.defaultRequirement;
form.addEventListener('reset', () => setTimeout(() => { if(form.dataset.defaultRequirement) form.elements.requirement.value = form.dataset.defaultRequirement; },0));
document.querySelectorAll('[data-requirement]').forEach(a => a.addEventListener('click', () => {form.elements.requirement.value = a.dataset.requirement;}));
const status = document.getElementById('form-status');
const submit = document.getElementById('submit');
const fallback = document.getElementById('whatsapp-fallback');
let pending = null;
let leadId = null;
window.addEventListener('message', event => {
  if (!pending || !['https://script.google.com','https://script.googleusercontent.com'].includes(event.origin) && !/^https:\/\/[a-z0-9-]+\.script\.googleusercontent\.com$/.test(event.origin)) return;
  if (event.data?.type !== 'mahadev-lead' || event.data.id !== pending.id) return;
  clearTimeout(pending.timer); pending.frame.remove(); pending = null; submit.disabled = false;
  if(event.data.ok){status.textContent='Thank you. Your enquiry has been saved. Our team can now review your requirement.';form.reset();leadId=null;fallback.hidden=true;}
  else {status.textContent='Your enquiry could not be saved. Please retry or send your details on WhatsApp.';fallback.hidden=false;}
});
form.addEventListener('submit', event => {
  event.preventDefault(); if(pending) return;
  const fields=Object.fromEntries(new FormData(form));
  const phone=fields.phone.replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'');
  if(!/^[6-9]\d{9}$/.test(phone)){status.textContent='Please enter a valid Indian mobile number (10 digits, optionally with +91).';form.elements.phone.focus();return;}
  fields.phone=phone;
  const message=['Hello Mahadev Properties,','I would like to discuss a property requirement.',...['name','phone','requirement','location','propertyType','budget','message'].map(key=>`${key}: ${fields[key]||'Not specified'}`)].join('\n');
  fallback.href='https://wa.me/918920030789?text='+encodeURIComponent(message);
  const endpoint=window.MAHADEV_CONFIG?.leadEndpoint;
  if(!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(endpoint)){status.textContent='Online enquiry saving is not available yet. Please use the WhatsApp link below to send your details directly.';fallback.hidden=false;return;}
  leadId ||= crypto.randomUUID(); fields.id=leadId; fields.consent='Yes'; fields.source=location.origin+location.pathname; fields.referrer=document.referrer; fields.utm=new URLSearchParams(location.search).toString().slice(0,1000);
  const frame=document.createElement('iframe');frame.name='lead-'+fields.id;frame.hidden=true;frame.title='Enquiry submission';document.body.append(frame);
  const post=document.createElement('form');post.method='POST';post.action=endpoint;post.target=frame.name;post.hidden=true;
  Object.entries(fields).forEach(([key,value])=>{const input=document.createElement('input');input.name=key;input.value=value;post.append(input);});
  document.body.append(post);submit.disabled=true;status.textContent='Saving your enquiry…';fallback.hidden=true;
  pending={id:fields.id,frame,timer:setTimeout(()=>{frame.remove();pending=null;submit.disabled=false;status.textContent='We could not confirm that your enquiry was saved. Retry with the same details or contact us on WhatsApp.';fallback.hidden=false;},25000)};
  post.submit();post.remove();
});


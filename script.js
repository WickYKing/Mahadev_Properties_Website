'use strict';
(function(){
  var year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();

  // Mobile menu
  var menu=document.getElementById('menu'), nav=document.getElementById('navigation');
  function closeMenu(){ if(!nav) return; nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); }
  if(menu && nav){
    menu.addEventListener('click',function(){
      var open=menu.getAttribute('aria-expanded')!=='true';
      nav.classList.toggle('open',open); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    });
    nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',closeMenu); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeMenu(); });
  }

  // Enquiry form (not present on every page)
  var form=document.getElementById('lead-form'); if(!form) return;
  var statusEl=document.getElementById('form-status'), submit=document.getElementById('submit'), fallback=document.getElementById('whatsapp-fallback'), waBtn=document.getElementById('send-whatsapp');
  if(form.dataset.defaultRequirement) form.elements.requirement.value=form.dataset.defaultRequirement;

  function say(t){ statusEl.textContent=t; }
  function uuid(){
    if(window.crypto && crypto.randomUUID) return crypto.randomUUID();           // HTTPS / localhost
    var b=new Uint8Array(16); (window.crypto||window.msCrypto).getRandomValues(b); // plain-HTTP fallback
    b[6]=(b[6]&15)|64; b[8]=(b[8]&63)|128;
    var h=Array.prototype.map.call(b,function(x){return ('0'+x.toString(16)).slice(-2);}).join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  }
  function collect(){
    if(!form.reportValidity()){ say('Please fill in the required fields marked *.'); return null; }
    var fields=Object.fromEntries(new FormData(form));
    fields.phone=String(fields.phone||'').replace(/\D/g,'').replace(/^0(?=\d{10}$)/,'').replace(/^91(?=\d{10}$)/,'');
    if(!/^[6-9]\d{9}$/.test(fields.phone)){ say('Please enter a valid 10-digit Indian mobile number.'); form.elements.phone.focus(); return null; }
    return fields;
  }
  var REQ={Purchase:'Buy a property',Sale:'Sell a property',Rent:'Rent or lease',Collaboration:'Collaboration'};
  function whatsappUrl(f){
    var rows=[['Name',f.name],['Mobile',f.phone],['Requirement',REQ[f.requirement]||f.requirement],['Location',f.location],['Property type',f.propertyType],['Budget / expected price',f.budget],['Details',f.message]];
    var lines=['Hello Mahadev Properties,','I would like to discuss a property requirement.',''].concat(rows.map(function(r){return r[0]+': '+(String(r[1]||'').trim()||'Not specified');}));
    return 'https://wa.me/918920030789?text='+encodeURIComponent(lines.join('\n'));
  }
  waBtn.addEventListener('click',function(){
    var f=collect(); if(!f) return;
    window.open(whatsappUrl(f),'_blank','noopener,noreferrer');
    say('WhatsApp has opened with your details. Tap Send in WhatsApp to deliver the message.');
  });

  var pending=null, leadId=null, fingerprint='';
  function trustedOrigin(o){
    return o==='https://script.google.com' || o==='https://script.googleusercontent.com' || /^https:\/\/[a-z0-9-]+[.-]script\.googleusercontent\.com$/.test(o);
  }
  window.addEventListener('message',function(e){
    if(!pending || !trustedOrigin(e.origin)) return;
    var d=e.data||{}; if(d.type!=='mahadev-lead' || d.id!==pending.id) return;
    clearTimeout(pending.timer); pending.frame.remove(); pending=null; submit.disabled=false; submit.textContent='Submit the form';
    if(d.ok){ say('Thank you. Your enquiry has been saved and our team will call you.'); fallback.hidden=true; form.reset(); if(form.dataset.defaultRequirement) form.elements.requirement.value=form.dataset.defaultRequirement; fingerprint=''; }
    else { say('Your enquiry could not be saved. Please try again, or send it on WhatsApp.'); fallback.hidden=false; }
  });

  form.addEventListener('submit',function(e){
    e.preventDefault(); if(pending) return;
    var f=collect(); if(!f) return;
    fallback.href=whatsappUrl(f);
    var endpoint=window.MAHADEV_CONFIG && window.MAHADEV_CONFIG.leadEndpoint;
    if(!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(endpoint)){
      say('Online saving is not available right now. Please send your details on WhatsApp.'); fallback.hidden=false; return;
    }
    var current=JSON.stringify(f); if(current!==fingerprint){ leadId=uuid(); fingerprint=current; }
    f.id=leadId; f.consent='Yes'; f.source=location.origin+location.pathname; f.referrer=document.referrer; f.utm=new URLSearchParams(location.search).toString().slice(0,1000);
    var frame=document.createElement('iframe'); frame.name='lead-'+f.id; frame.hidden=true; frame.title='Enquiry submission'; document.body.appendChild(frame);
    var post=document.createElement('form'); post.method='POST'; post.action=endpoint; post.target=frame.name; post.hidden=true;
    Object.keys(f).forEach(function(k){ var i=document.createElement('input'); i.type='hidden'; i.name=k; i.value=f[k]; post.appendChild(i); });
    document.body.appendChild(post);
    submit.disabled=true; submit.textContent='Submitting…'; say('Submitting your enquiry…'); fallback.hidden=true;
    pending={id:f.id,frame:frame,timer:setTimeout(function(){
      frame.remove(); pending=null; submit.disabled=false; submit.textContent='Submit the form';
      say('We could not confirm your enquiry was saved. Please try again, or send it on WhatsApp.'); fallback.hidden=false;
    },25000)};
    post.submit(); post.remove();
  });
})();

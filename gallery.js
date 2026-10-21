'use strict';
(function(){
  var box=document.getElementById('reels'); if(!box) return;
  var profile=box.dataset.profile, PAGE=6;
  var ids=[];
  (window.MAHADEV_REELS||[]).forEach(function(u){
    var m=String(u).match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    if(m && ids.indexOf(m[2])<0) ids.push(m[2]);
  });
  var videos=(window.MAHADEV_VIDEOS||[]).filter(function(v){return v && /^assets\/videos\/[\w.-]+\.(mp4|webm)$/i.test(v.file);});

  videos.forEach(function(v){
    var fig=document.createElement('figure'); fig.className='reel-video';
    var vid=document.createElement('video'); vid.src=v.file; vid.controls=true; vid.preload='metadata'; vid.playsInline=true;
    fig.appendChild(vid);
    if(v.title){var c=document.createElement('figcaption'); c.textContent=v.title; fig.appendChild(c);}
    box.appendChild(fig);
  });

  function reelCard(id,n){
    var fig=document.createElement('figure'); fig.className='reel';
    var f=document.createElement('iframe');
    f.src='https://www.instagram.com/reel/'+id+'/embed/';
    f.title='Mahadev Properties property video '+n;
    f.loading='lazy'; f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('scrolling','no');
    var cap=document.createElement('figcaption');
    var a=document.createElement('a'); a.href='https://www.instagram.com/reel/'+id+'/'; a.target='_blank'; a.rel='noopener'; a.textContent='Open on Instagram';
    var e=document.createElement('a'); e.href='#enquiry'; e.textContent='Enquire about this property';
    e.addEventListener('click',function(){var m=document.querySelector('#lead-form [name=message]'); if(m && !m.value) m.value='About your Instagram video: https://www.instagram.com/reel/'+id+'/';});
    cap.appendChild(e); cap.appendChild(a); fig.appendChild(f); fig.appendChild(cap);
    return fig;
  }
  var shown=0, more=null;
  function showMore(){
    ids.slice(shown,shown+PAGE).forEach(function(id,i){ box.appendChild(reelCard(id,shown+i+1)); });
    shown=Math.min(ids.length,shown+PAGE);
    if(shown<ids.length){
      if(!more){ more=document.createElement('div'); more.className='reels-more'; var b=document.createElement('button'); b.type='button'; b.className='btn btn-line'; b.addEventListener('click',showMore); more.appendChild(b); box.after(more); }
      more.firstChild.textContent='Show more videos ('+(ids.length-shown)+')';
    } else if(more){ more.remove(); }
  }
  if(ids.length) showMore();

  if(!ids.length && !videos.length){
    box.innerHTML='<div class="reel-empty"><h3>Watch our property videos on Instagram</h3><p>Our latest property walkthroughs and reels are on our official Instagram account, @mahadevproperties247.</p><a class="btn btn-saffron" target="_blank" rel="noopener"></a></div>';
    var a=box.querySelector('a'); a.href=profile; a.textContent='Open @mahadevproperties247';
  }
})();

(()=>{
  const common=window.ABService||{};
  const leadApiUrl=Object.prototype.hasOwnProperty.call(common,'leadApiUrl')?common.leadApiUrl:'/api/lead';

  const nav=document.querySelector('.nav');
  const wrap=document.querySelector('.nav-wrap');
  if(nav&&wrap){
    wrap.classList.add('header-nav-enabled');
    const service=[...nav.querySelectorAll(':scope > a')].find(a=>a.getAttribute('href')==='../');
    let parts=[...nav.querySelectorAll(':scope > a')].find(a=>a.classList.contains('nav-parts-link'));
    if(!parts){
      parts=document.createElement('a');
      parts.href='./';
      parts.textContent='Запчасти';
      parts.className='nav-product nav-parts-link is-active';
      if(service) service.insertAdjacentElement('afterend',parts); else nav.prepend(parts);
    }
    if(service) service.classList.add('nav-product');
    parts.classList.add('nav-product','is-active');
    parts.setAttribute('aria-current','page');
    [...nav.querySelectorAll(':scope > a')].forEach(a=>{
      if(a!==service&&a!==parts) a.classList.add('nav-secondary');
    });
    if(common.ensureProductNavStyles) common.ensureProductNavStyles();
  }

  const form=document.getElementById('partsForm');
  const modeInput=document.getElementById('partsMode');
  const requestField=document.getElementById('partRequest');
  const modeButtons=[...document.querySelectorAll('.mode-btn')];
  function setMode(mode){
    const install=mode==='install';
    if(modeInput) modeInput.value=install?'Запчасть + установка':'Только запчасть';
    modeButtons.forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    const url=new URL(window.location.href);
    if(install) url.searchParams.set('service','install'); else url.searchParams.delete('service');
    history.replaceState({},'',url);
  }
  document.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>{
    setMode(el.dataset.mode);
    if(el.dataset.hint&&requestField) requestField.value=el.dataset.hint;
  }));
  modeButtons.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  const params=new URLSearchParams(location.search);
  if(params.get('service')==='install') setMode('install');

  if(form) form.addEventListener('submit',async e=>{
    e.preventDefault();
    const status=document.getElementById('partsStatus');
    const button=form.querySelector('button[type="submit"]');
    if(!leadApiUrl){
      if(status){status.textContent='Интеграция с Telegram настраивается. Для срочного запроса позвоните 8 800 555-44-33.';status.style.display='block'}
      return;
    }
    if(button){button.disabled=true;button.textContent='Отправляем…'}
    if(status){status.textContent='Отправляем запрос…';status.style.display='block'}
    try{
      const data=new FormData(form);
      const {attachments,skipped}=await common.collectAttachments(form);
      const payload={
        kind:'parts',
        source:location.href,
        mode:data.get('mode')||'',
        name:data.get('name')||'',
        phone:data.get('phone')||'',
        machine:data.get('machine')||'',
        article:data.get('article')||'',
        part:data.get('part')||'',
        attachments,
        attachmentsSkipped:skipped
      };
      await common.postLead(payload);
      form.reset();
      setMode('part');
      if(status) status.textContent=skipped?'Запрос отправлен в ABService. Большое фото не приложено — при необходимости мы запросим его отдельно.':'Запрос отправлен в ABService. Мы свяжемся с вами по указанному телефону.';
    }catch(err){
      console.error(err);
      if(status) status.textContent='Не удалось отправить запрос. Позвоните нам: 8 800 555-44-33.';
    }finally{
      if(button){button.disabled=false;button.textContent='Отправить на подбор'}
    }
  });
})();

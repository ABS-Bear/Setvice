(()=>{
  const common=window.ABService||{};
  const leadApiUrl=Object.prototype.hasOwnProperty.call(common,'leadApiUrl')?common.leadApiUrl:'/api/lead';

  const nav=document.querySelector('.nav');
  const wrap=document.querySelector('.nav-wrap');
  if(nav&&wrap){
    wrap.classList.add('header-nav-enabled');
    const links=[...nav.querySelectorAll(':scope > a')];
    const service=links.find(a=>a.getAttribute('href')==='#services');
    const parts=links.find(a=>a.getAttribute('href')==='parts/');
    if(service){
      service.textContent='Сервис';
      service.classList.add('nav-product','is-active');
      service.setAttribute('aria-current','page');
    }
    if(parts) parts.classList.add('nav-product');
    links.forEach(a=>{
      if(a!==service&&a!==parts) a.classList.add('nav-secondary');
    });
    if(common.ensureProductNavStyles) common.ensureProductNavStyles();
  }

  document.querySelectorAll('[data-photo]').forEach(el=>el.addEventListener('click',()=>{
    setTimeout(()=>{
      const file=document.querySelector('input[type="file"]');
      if(file) file.closest('label').scrollIntoView({behavior:'smooth',block:'center'});
    },400);
  }));

  const leadForm=document.getElementById('leadForm');
  if(leadForm) leadForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const status=document.getElementById('status');
    const button=leadForm.querySelector('button[type="submit"]');
    if(!leadApiUrl){
      if(status){status.textContent='Интеграция с Telegram настраивается. Для срочного обращения позвоните 8 800 555-44-33.';status.style.display='block'}
      return;
    }
    if(button){button.disabled=true;button.textContent='Отправляем…'}
    if(status){status.textContent='Отправляем заявку…';status.style.display='block'}
    try{
      const data=new FormData(leadForm);
      const {attachments,skipped}=await common.collectAttachments(leadForm);
      const payload={
        kind:data.get('kind')||'service',
        source:location.href,
        name:data.get('name')||'',
        phone:data.get('phone')||'',
        machine:data.get('machine')||'',
        location:data.get('location')||'',
        issue:data.get('issue')||'',
        attachments,
        attachmentsSkipped:skipped
      };
      await common.postLead(payload);
      leadForm.reset();
      if(status) status.textContent=skipped?'Заявка отправлена в ABService. Большой файл не приложен — при необходимости мы запросим его отдельно.':'Заявка отправлена в ABService. Мы свяжемся с вами по указанному телефону.';
    }catch(err){
      console.error(err);
      if(status) status.textContent=`Не удалось отправить заявку. Причина: ${err.message||'неизвестная ошибка'}`;
    }finally{
      if(button){button.disabled=false;button.textContent='Отправить заявку'}
    }
  });
})();

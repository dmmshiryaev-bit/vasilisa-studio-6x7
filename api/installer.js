'use strict';
const cloud=require('../cloud-downloads.json');
const FILES={windows:'Vasilisa-Setup-0.2.0.exe',android:'Vasilisa-Android-0.2.0.apk'};
module.exports=async function handler(req,res){
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return res.status(405).end()}
  const device=typeof req.query.device==='string'?req.query.device:'';
  if(!Object.hasOwn(FILES,device))return res.status(400).json({error:'Выберите Windows или Android.'});
  try{
    const url=new URL('https://cloud-api.yandex.net/v1/disk/public/resources/download');
    url.searchParams.set('public_key',cloud.folder);url.searchParams.set('path','/'+FILES[device]);
    const result=await fetch(url,{signal:AbortSignal.timeout(15000)});
    if(!result.ok)throw new Error('Cloud download unavailable');
    const data=await result.json();const direct=new URL(data.href);
    if(direct.protocol!=='https:'||!['yandex.ru','yandex.net','yandex.com','yandexcloud.net'].some(domain=>direct.hostname===domain||direct.hostname.endsWith('.'+domain)))throw new Error('Unexpected download host');
    res.setHeader('Cache-Control','no-store');res.setHeader('Location',direct.href);return res.status(302).end();
  }catch{
    res.setHeader('Content-Type','text/html; charset=utf-8');
    return res.status(503).send('<!doctype html><html lang="ru"><meta charset="utf-8"><title>Скачать игру</title><h1>Скачивание временно недоступно</h1><p>Откройте папку с установщиками на Яндекс Диске:</p><a href="'+cloud.folder+'">Игры для детей</a></html>');
  }
};

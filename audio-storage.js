'use strict';
const VasilisaAudioStore = {
  open() {
    return new Promise((resolve,reject) => {
      if (typeof indexedDB === 'undefined') {reject(new Error('Хранилище недоступно'));return}
      const request=indexedDB.open('vasilisa-media',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('audio');
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
  },
  async load() {
    const db=await this.open();
    return new Promise((resolve,reject)=>{const tx=db.transaction('audio','readonly'),request=tx.objectStore('audio').get('song');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close();});
  },
  async save(file) {
    const db=await this.open();
    return new Promise((resolve,reject)=>{const tx=db.transaction('audio','readwrite');tx.objectStore('audio').put({blob:file,name:file.name},'song');tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error)};});
  }
};

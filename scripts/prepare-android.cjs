const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const res=path.join(root,'android/app/src/main/res');
for(const density of ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi']){
 const dir=path.join(res,'mipmap-'+density);fs.mkdirSync(dir,{recursive:true});
 for(const name of ['ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png'])fs.copyFileSync(path.join(root,'img/icon-192.png'),path.join(dir,name));
}

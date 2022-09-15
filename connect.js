var shell = WScript.CreateObject("WScript.Shell");
var fs = WScript.CreateObject("Scripting.FileSystemObject");

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

WScript.StdOut.Write("¬ведите ID скрипта: ");
var id = ""+WScript.StdIn.ReadLine();

if(get("http://yfiles.22web.org/RemoteCMD/"+id+".txt") == "cmd:script_not_runned"){
	WScript.StdOut.Write("—крипт не был запущен.\n");
	WScript.StdIn.ReadLine();
	WScript.Quit();
}

while(true){
	WScript.StdOut.Write("\ncmd> ");
	var cmd = ""+WScript.StdIn.ReadLine();
	get("http://yfiles.22web.org/RemoteCMD/write.php?name="+id+".txt&data=cmd:"+cmd);
	var res = "cmd:"+cmd;
	while(res.indexOf("cmd:")>-1){
		res = get("http://yfiles.22web.org/RemoteCMD/"+id+".txt");
		WScript.Sleep(2000);
	}
	WScript.StdOut.Write(res);
}
#coding=utf-8
import os  
import hashlib  
import time  
import shutil
import subprocess
import zipfile

#修改版本号
version = "1.0.0.1"

ROOT_DIR = os.getcwd()
SRC_DIR = os.path.join(ROOT_DIR, 'build/jsb-default')
DST_DIR = os.path.join(ROOT_DIR, 'hotupdate') 
VER_DIR = os.path.join(DST_DIR, 'v' + version) 

#压缩目录或文件
zip_paths = {
	"res/import",
	"src/cocos2d-jsb.js",
}


def getFileMd5(filename):  
    if not os.path.isfile(filename):  
        return 
		
	#检测路径名是否包含空格 (下载时路径若包含空格则会导致下载失败)
    if filename.find(" ") != -1:
        print(" \n ^^^^^^ has space in file name !!!!: \n" + filename + "\n")
        assert False
		
    myhash = hashlib.md5()
    f = file(filename,'rb')  
    while True:  
        b = f.read(8096)
        if not b :  
            break  
        myhash.update(b)
    f.close()  
    return myhash.hexdigest()  

def walk(path):
    xml = ""
    for parent,dirnames,filenames in os.walk(path):
        for filename in filenames:
            pathfile = os.path.join(parent, filename)
            md5 = getFileMd5(pathfile)
            name = pathfile[len(path)+1:]
            name = name.replace('\\', '/')
			#如果是压缩文件则添加 compressed 字段
            if os.path.splitext(pathfile)[1] == '.zip':
				if xml == "":
					xml = "\n\t\t\"%s\" : {\n\t\t\t\"md5\" : \"%s\",\n\t\t\t\"compressed\" : \"true\"\n\t\t}" % (name, md5)
				else:
					xml += ",\n\t\t\"%s\" : {\n\t\t\t\"md5\" : \"%s\",\n\t\t\t\"compressed\" : \"true\"\n\t\t}" % (name, md5)				
            else:
				if xml == "":
					xml = "\n\t\t\"%s\" : {\n\t\t\t\"md5\" : \"%s\"\n\t\t}" % (name, md5)
				else:
					xml += ",\n\t\t\"%s\" : {\n\t\t\t\"md5\" : \"%s\"\n\t\t}" % (name, md5)
    return xml


#input_path:相对路径(相对于脚本路径)
def zip_files(zipPaths, bDeleteAfterZip):
	#更改工作路径到版本目录, 即同 res , src 目录同级。否则压缩包里的相对路径不是跟 res 和 src 同级。
	os.chdir(VER_DIR) 
	
	#递归加入目录
	def get_zip_file(input_path, result):
		if os.path.isfile(input_path):
			result.append(input_path)
		else:
			files = os.listdir(input_path)
			for file in files:
				tmpInput = input_path + '/' + file
				if os.path.isdir(tmpInput):
					get_zip_file(tmpInput, result) 
				else: 
					result.append(tmpInput)
			
	#开始压缩
	for src in zipPaths:
		#输出路径名
		outputPath = ''
		if os.path.isdir(src):
			outputPath = src + '.zip'
		else:
			info = os.path.splitext(src)
			outputPath = info[0] + '.zip'
		
		#去掉目录最后的斜杠
		while src[-1] == '/':
			src = src[:-1]
		
		#输入路径
		filelist = []
		get_zip_file(src, filelist)
		
		#开始压缩
		print('outputPath:' + outputPath)
		f = zipfile.ZipFile(outputPath, 'w', zipfile.ZIP_DEFLATED)
		for file in filelist:
			f.write(file)
		f.close()
		
		#删除相应的目录、文件
		if bDeleteAfterZip:
			if os.path.isdir(src):
				shutil.rmtree(src)
			else:
				os.remove(src)
	
	#恢复原工作路径 
	os.chdir(ROOT_DIR) 
	

def main():
    #修改版本号
    
    hot_url = "http://192.168.3.253:8080/" 
    app_download_url = "http://abc.9happytech.com/startgame.html" 

    #创建目录hotupdate, 其包含两个manifest文件和版本目录, 该版本目录存放当前热更资源 
    if os.path.exists(DST_DIR):
        shutil.rmtree(DST_DIR)
    os.mkdir(DST_DIR)

    #创建版本目录
    os.mkdir(VER_DIR)

    #拷贝资源
    shutil.copytree(SRC_DIR + '/res', os.path.join(VER_DIR, 'res'))
    shutil.copytree(SRC_DIR + '/src', os.path.join(VER_DIR, 'src'))
	
	#如果有需要压缩的目录或文件,则先压缩
    zip_files(zip_paths, True) 
	
    #开始生成资源列表
    assets = walk(VER_DIR)

    xml = '{'\
    + '\n\t"version" : "' + version + '",'\
    + '\n\t"packageUrl" : "' + hot_url + 'v'+ version + '/'+ '",'\
    + '\n'\
    + '\n\t"assets" : {'\
    + assets\
    + '\n\t},'\
    + '\n\t"searchPaths" : ['\
    + '\n\t]'\
    + '\n}'
    
    f = file(os.path.join(VER_DIR, 'project.manifest'), 'w+')
    f.write(xml)
    f.close()
    print 'generate project.manifest finish.'

    #save to file: version.manifest
    xml = '{'\
    + '\n\t"version" : "' + version + '",'\
    + '\n\t"manifestUrl" : "' + hot_url + '",'\
    + '\n\t"appDownLoadUrl" : "' + app_download_url + '"'\
    + '\n}'
    f = file(os.path.join(VER_DIR, 'version.manifest'), 'w+')
    f.write(xml)
    f.close()
    print 'generate version.manifest finish.'

    # manefest文件拷贝一份放到外面
    shutil.copyfile(os.path.join(VER_DIR, 'project.manifest'), os.path.join(DST_DIR, 'project.manifest')) 
    shutil.copyfile(os.path.join(VER_DIR, 'version.manifest'), os.path.join(DST_DIR, 'version.manifest')) 


if __name__ == "__main__":
    main()

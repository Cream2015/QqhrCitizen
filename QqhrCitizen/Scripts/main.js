function validateSearchKey(keyWords)
{	 
	 if (keyWords == "")
            {
                top.Alert('请输入搜索内容');
                return false;
            }
            var reg = new RegExp('^[^@\/\\#$%&\^\*\<\>]+$');
            if (!reg.test(keyWords)) {
                  top.Alert('搜索的内容不能输入特殊字符 ^ @ / \ # $ % & * < >');
                return false;
            }
        return true;
}
	

# 项目虚拟环境及包管理
## 安装pyenv


```
git clone https://github.com/yyuu/pyenv.git ~/.pyenv

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc

echo 'eval "$(pyenv init -)"' >> ~/.bashrc

exec $SHELL
```


## 安装Python开发包


```
sudo apt-get build-dep python2.7
```


## 使用pyenv

### 查看可安装的Python版本


```
pyenv install --list
```


### 安装某个Python版本


```
pyenv install 3.5.2
```


### 查看已安装的Python版本


```
pyenv versions
```


### 切换Python版本


```
pyenv global x.x.x
```


### 临时改变Python版本


```
pyenv local 3.4.0   # 在当前目录改变python版本
pyenv local --unset # 取消改变
pyenv global 3.4.0  # 全局改变python版本
pyenv shell 3.4.0   # 改变当前shell的python版本
```


### 卸载某个版本的Python


```
pyenv uninstall 3.5.2
```


## 使用virtualenv


### 创建虚拟环境


```
pyenv virtualenv 2.7.8 env278
```


### 激活虚拟环境

```
pyenv activate env278
```


### 退出虚拟环境


```
pyenv deactivate
```


### 删除虚拟环境
直接删除目录


```
rm -rf ~/.pyenv/versions/env278/
```

# Python包管理


## 安装pip


```
sudo apt-get install pip
```


## 更新pip


```
pip install -U pip
```


## 搜索python包


```
pip search "django"
```


## 安装python包


```
pip install SomePackage    #最新版本
pip install SomePackage==1.0.4    #指定版本
pip install 'SomePackage>=1.0.4'    #最小版本。
```


## 升级python包


```
pip install -U SomePackage
```


## 卸载python包


```
pip uninstall SomePackage
```


## 查看当前环境已安装的python包


```
pip freeze
```


## 在项目中使用requirements文件


```
pip freeze>requirements.txt
```


## 根据requirements生成相同环境


```
pip install -r requirements.txt
```


# 工具与环境列表


```
Ubuntu 15.04
django 1.8
python 3.5.2
mysql
nginx
uWSGI 3.0.11.1
vim 7.4
git
github
```


# 正式编码前应考虑的问题


* 项目需求
* 开发技术选型
* 安全性
* 可访问性
* 搜索引擎优化
* 架构与部署



# Web应用程序开发步骤


* 从需求确定功能
* 从功能确定页面表现形式
* 页面设计
* 功能实现
* 静态页面与功能结合转动态页面
* 测试确保功能正常
* 完成与部署


# 团队开发合作流程


## 团队角色


* 需求方
* 产品部门
* 研发部门
* 运维部门


## 合作流程


* 准备团队开发环境(vagrant，docker，公共服务器角色、权限...)
* 需求分析、问题跟踪、评审与反馈(Trac, Rally)
* 编写设计文档与开发文档(Sphinx，Markdown，AsciiDoc)
* 功能模块拆分设计与实现(包、模块、接口、类、函数的设计与实现)
* 单元测试(unittest，nose，mock)
* 项目打包与环境建立自动化(pypi,setup,pip)
* 源码版本管理(GitLab, Github)
* 持续集成(Jenkins, Buildbot)
* 部署与公开发布(Fabric)


# 需求分析


## 需求分析


确定新系统的目的、范围、定义和功能时所要做的所有工作。难点在于把握客户真实需求，往往需求方提出的只是表象，而不是真实需求的本质，研发部门要让开发工作变得容易，必须把握住表象之下的软件/程序设计相关的本质。


## 主要目的


让项目实现的功能/过程是可预见的。企业级项目开发，需要在敲代码前进行需求分析、总体设计、详细设计。在设计的过程中会发现最初需求/实现流程/技术栈等要求不合理的地方，越早地发现不合理的地方纠错成本越低。


## 编码前至少三个评审会议


* 做不做（技术、人员、经济、法律等各方面是否允许）
* 怎么做（需求、原型、设计、架构等）
* 谁来做（人员、工期、迭代周期等）

## 客户需求描述


我们要做一个在线购物系统销售月饼、嫦娥吴刚神话书籍以及月兔等周边玩偶。顾客第一次访问网站，主页将显示一些特色产品、分类列表，还要有搜索框供顾客搜索。顶部要有一个导航条。产品列表中要包含产品缩略图，产品名称，点击它可以进入产品详情页面。一个产品可以属于多个分类。还要有个页面让我们自己添加新的产品类别和相关产品，但是只有店长才能使用这个功能，普通员工是不允许的。网站上线之后，要使顾客能够通过搜索引擎搜索到我们的网站。产品可以被添加到一个购物车。订单结算页面是单独的，这个页面向顾客展示当次购物结算信息以及让顾客提交订单给我们，还可以使用支付宝在线付款。要保证顾客信息、订单信息等数据的存储安全，不能被黑客拿去了。还需要对网站交易进行分析，需要知道哪些人，在哪些地方，买了哪种东西，方便我们做更有效的推荐商品。还要知道订单的转化率。当订单提交以后，顾客可以查看订单的处理状态，比如是“已提交”，“正在处理产品”，“已发货”，“已完成”等等。顾客也可能退货，退货时需要把钱退给顾客，以及我们会扣一部分手续费，让顾客能方便地看到我们的退货政策。



# 系统模块划分及大型web结构


本购物系统需求清单
* 多种产品的销售（通用的产品模型）
* 产品分类模型
* 特殊产品的处理
* 产品搜索
* 导航条
* 产品列表页面
* 产品详情页面
* 产品类别及产品的管理(增、删、改、查 CRUD)
* 权限管理
* SEO，搜索引擎优化（生成站点地图）
* 购物车模块
* 订单结算页面
* 订单结算系统
* 在线支付模块系统
* 网络安全（尽量避免bug，以及不能出现XSS之类的漏洞）
* 订单数据统计（分析）
* 订单状态跟踪
* 退货、退款
* 信息发布与管理（CMS）


# 团队开发重要工作:书写项目文档


## 大型项目必要文档


* 总体设计：项目架构、技术选型、系统模型等说明文档
* 项目管理：需求分析、预算、风险、人员安排、进度计划 等
* 使用文档：项目运行的必要信息、步骤、系统环境等
* 需求文档：定义项目应该做什么
* 详细设计：定义项目应该怎么做
* 支持文档：面向技术支持团队的培训资料，问题解决方案
* 用户文档：使用说明书，接口指南等


## 小型项目文档应有内容


* 概述项目的作用，要解决的问题
* 项目采用的分发许可证
* 使用例子（quick start）
* 安装指南
* 指向社区支持、邮件列表、论坛的链接
* 指向bug跟踪、问题反馈、代码提交的链接
* 源码链接


## Sphinx & reStructuredText    


Sphinx是一个文档生成工具，采用reStructuredText语法格式。


## Markdown


* Markdown 语法说明 (简体中文版)
* Mastering Markdown

>使用atom，可以ctrl + shift + p调出命令框，输入mdpt(markdown preview toggle),atom会分屏预览


## docstring


## doctest


# 使用MySql驱动项目


## 安装MySQL


```
sudo apt-get install mysql-server
```


## 创建数据库与账户


```
CREATE DATABASE shopsys CHARACTER SET utf8;
CREATE  USER  'shopsys'@'localhost'  IDENTIFIED  BY  '12345678';
GRANT ALL ON shopsys.* TO 'shopsys';
```


## 为django配置数据库


django默认需要MySQLdb驱动，不支持py3。开发中使用mysqlclient（django建议的）代替，支持py3


配置参考  https://docs.djangoproject.com/en/1.8/ref/settings/#databases


多数据库支持


根据django提供的多数据库支持，我们可以很方便地为不同的模块，不同的模型（Model）设置不同的数据库来存储，也可以设置主从库、副本集等分布式数据库服务。


https://docs.djangoproject.com/en/1.8/topics/db/multi-db/#topics-db-multi-db-routing


## 安装mysqlclient驱动


```
pyenv activate shopsys
pip install mysqlclient
```


## 告诉django数据库引擎的变更


## 检验数据库配置


```
~$ mysql -u shopsys -p
mysql > use shopsys;
mysql> show tables;
```


## 提交更改的代码到git远程仓库


>特别注意:
>一定要注意敏感信息的保护。如数据库详细配置、各种加密密钥、企业真实服务器IP、端口、私密接口、用户信息等。    
>实际生产中会拆分settings.py并配合使用环境变量（受保护的文件还会额外加密）以保证敏感信息的安全。    
>在“部署”的章节中会为大家详细讲解真实生产环境中的配置方案。前期注意力先集中在django核心功能的学习上。


# 完善项目目录结构与添加产品分类


## 完善项目目录结构


## 创建catalog应用及配置


```
cd /opt/shopsys/shopsys
django-admin startapp
```


# 分类及产品模型的设计与实现


## 前置准备


ER图（实体关系模型设计）


UML类图（类的设计）


## Category模型


## Product模型


## django常用字段类型


* BooleanField
* CharField
* TextField
* DateField
* DateTimeField
* DecimalField
* FileField
* FilePathField
* FloatField
* ImageField
* IntegerField
* SlugField


更多参考：https://docs.djangoproject.com/en/1.8/ref/models/fields/#field-types


附:


* 安装Pillow


```
sudo apt-get install libjpeg-dev
pip install --no-cache-dir -I Pillow
```


* 生成 requirements.txt


```
cd /opt/shopsys
pyenv activate shopsys
pip freeze > requirements.txt
```


# 使用Admin管理模型


## 添加admin应用


创建超级管理员


```
python manage.py createsupperuser
```


## 注册模型至admin


## 为admin模型字段添加自定义验证


## 运行项目检查结果


## 提交代码到远程仓库的feature-catalog分支


# 模型的变更与同步


# 配置URLConf及添加views处理函数


＃

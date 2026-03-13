---
title: yolov5/yolov3训练自己的数据集
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2026-03-06 20:02:31
updated: 2026-03-06 20:02:31
topic:
banner:
references:
---

YOLO系列是非常优秀的物体检测框架，目前总共有V1-V5五个版本。本博客的目的在于教大家如何使用YOLOv5训练自己的数据，重点在于应用。有关原理我会在后面的博客中详细介绍。使用YOLOv5训练自己的数据往往要经过以下几个步骤：



一、环境配置

在环境配置方面，我安装的是tensorflow-gpu2.3.0、cuda10.1、cudnn7.6.4、torch1.9.0、anaconda我选择的是python3.8版本。有关详细的安装过程大家可以参考我的另一篇博客《Tensorflow-gpu2.1.0+cuda+cudnn+torch安装教程（超详细）》博客地址：

CSDN

二、克隆源代码

目前GitHub上有非常多的YOLOv5代码，其中YOLOv5论文的源代码地址为：

GitHub - ultralytics/yolov5: YOLOv5 🚀 in PyTorch > ONNX > CoreML > TFLite，建议大家尽量去下载“官方代码”。具体如下图所示:



 然后点击Code会弹出下载选项，具体如下图所示：



 当下载完YOLOv5工程压缩文件后，保存在你想要保存的位置然后进行解压，介意大家最好新建一个文件夹专门存放YOLOv5工程代码。



 解压后的文件如下图所示：

 

 至此，我们就完成了源代码的下载。

三、调试源代码

当下载完源代码以后，我们就可以开始调试源代码。确保源代码可以正常运行后，再开始训练我们的数据。下载完成后打开requirements.txt文件，安装工程需要的python包。



 大家可以根据自己的情况选择性的安装。这里并不介意大家直接安装官方指导进行安装。当安装完所需要的库时接下来就可以进行代码的调试。

使用notebook打开我们的工程文件中的tutorial.ipynb文件，首先打开notebook打开的过程中应该注意在jupyter notebook后面添加你的工程路径，这样你才能进入此工程目录下。如下图所示:





 打开notebook后点击tutorial.ipynb文件。进入后的界面如下图所示：



  然后按照官网的要求进行代码调试。如果大家事先安装好了环境，并且按照上面的步骤打开tutorial.ipynb文件，可以注释掉前三行代码，然后运行后面的代码即可。具体如下图所示：



当大家运行第二行代码时，可能发现代码运行错误，具体的错误如上图所示。报错的原因在于没有在系统文件中找到yolov5s.pt。大家可以尝试去找一下，发现确实工程中不存在此文件。 



 接下来需要解决此错误。首先打开GitHub中的工程文件，然后拉到页面最下面，点击yolov5s。具体如下图所示：



 点击进去后的界面如下图所示：



 然后将此界面拉到最低下，就可以看到yolov5s.pt的下载界面，具体如下图所示：



 然后点击yolov5s.pt进行下载。



 这样我们就完成了yolov5s.pt的下载，如果后续开发中还需要其他的工具，也可以直接在原工程中进行下载。接下来我们需要在工程目录中新建“weights”文件夹。具体如下图所示：



 然后再将刚刚下载的yolov5s.pt文件复制在此目录下，具体如下图所示：



接下来我们就可以进行模型的检测程序了。然后修改原运行代码，在yolov5s.pt前面添加./weights/,这样就可以进行代码的正常测试了。也即

!python detect.py --weights ./weights/yolov5s.pt --img 640 --conf 0.25 --source data/images/



 代码运行结果如下：



 如果看到上特的检测结果，那就表明我们的程序可以进行正常运行了。当然，我们也可以调用摄像头进行物体的实时检测，具体的命令是：

!python detect.py --weights ./weights/yolov5s.pt --source 0  运行的结果如下图所示:



 至此，我们就完成了代码的调试。

四、准备自己的数据集并标注

在完成了代码调试后就可以进行训练自己的数据了。首先准备自己的数据集，然后进行标注。首先将所有要打标签的图片存放在data下面的images文件夹中，（这点比较重要，千万注意路径images文件夹一定要放在data下面，如果放在外面那需要修改split.py文件中的路径。并且，要标注的图片直接放在images文件夹下）具体如下图所示：



 然后在工程中的data文件夹下新建两个文件夹，分别为dataset、labels。其中，datasets主要用来存放打好标签后的数据集，labels主要用来存放数据标签。具体如下图所示：



 创建好文件夹后，进行过数据的标注。标注的工具选用labelimg。首先安装labelimg然后启动:



（我事先已经安装好了，所以会有这样的提示）



 启动后的界面如下图所示：



 接下来，我们首先需要对labelimg进行一些设置：首先选择自动保存模型，然后再选择改变保存路径，最后打开图片文件进行数据的标注。具体操作如下面几张图所示：





 然后开始给图片打标签 



 对所有的图片都进行打标签，最后可以在dataset文件夹中，看到我们打好标签的xml文件。具体如下图所示：



 这样我们就完成了数据的标注。

五、数据预处理与源代码修改

接下来需要对标注好的数据进行预处理操作，首先在工程目录文件下新建split.py程序，具体如下所示：



 split.py的具体代码如下所示：

import os
import random
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--xml_path', default='data/dataset', type=str, help='input xml label path')
parser.add_argument('--txt_path', default='data/labels', type=str, help='output txt label path')
opt = parser.parse_args()
trainval_percent = 1.0
train_percent = 0.8
xmlfilepath = opt.xml_path
txtsavepath = opt.txt_path
total_xml = os.listdir(xmlfilepath)
if not os.path.exists(txtsavepath):
    os.makedirs(txtsavepath)
num = len(total_xml)
list_index = range(num)
tv = int(num * trainval_percent)
tr = int(tv * train_percent)
trainval = random.sample(list_index, tv)
train = random.sample(trainval, tr)
file_trainval = open(txtsavepath + '/trainval.txt', 'w')
file_test = open(txtsavepath + '/test.txt', 'w')
file_train = open(txtsavepath + '/train.txt', 'w')
file_val = open(txtsavepath + '/val.txt', 'w')
for i in list_index:
    name = total_xml[i][:-4] + '\n'
    if i in trainval:
        file_trainval.write(name)
        if i in train:
            file_train.write(name)
        else:
            file_val.write(name)
    else:
        file_test.write(name)
file_trainval.close()
file_train.close()
file_val.close()
file_test.close()
AI写代码
python
运行

然后运行此代码，运行完成后的结果如下图所示：



 然后以同样的方式再创建xml_to_txt.py文件并运行，具体如下图所示：



 xml_to_txt.py代码如下：

import xml.etree.ElementTree as ET
from tqdm import tqdm
import os
from os import getcwd

sets = ['train', 'val', 'test']
classes = ['1','5']   # 这里改为你要训练的标签，否则会报错。比如你要识别“hand”，那这里就改为hand

def convert(size, box):
    dw = 1. / (size[0])
    dh = 1. / (size[1])
    x = (box[0] + box[1]) / 2.0 - 1
    y = (box[2] + box[3]) / 2.0 - 1
    w = box[1] - box[0]
    h = box[3] - box[2]
    x = x * dw
    w = w * dw
    y = y * dh
    h = h * dh
    return x, y, w, h

def convert_annotation(image_id):
    # try:
        in_file = open('data/dataset/%s.xml' % (image_id), encoding='utf-8')
        out_file = open('data/labels/%s.txt' % (image_id), 'w', encoding='utf-8')
        tree = ET.parse(in_file)
        root = tree.getroot()
        size = root.find('size')
        w = int(size.find('width').text)
        h = int(size.find('height').text)
        for obj in root.iter('object'):
            difficult = obj.find('difficult').text
            cls = obj.find('name').text
            if cls not in classes or int(difficult) == 1:
                continue
            cls_id = classes.index(cls)
            xmlbox = obj.find('bndbox')
            b = (float(xmlbox.find('xmin').text), float(xmlbox.find('xmax').text), float(xmlbox.find('ymin').text),
                 float(xmlbox.find('ymax').text))
            b1, b2, b3, b4 = b
            # 标注越界修正
            if b2 > w:
                b2 = w
            if b4 > h:
                b4 = h
            b = (b1, b2, b3, b4)
            bb = convert((w, h), b)
            out_file.write(str(cls_id) + " " +
                           " ".join([str(a) for a in bb]) + '\n')
    # except Exception as e:
    #     print(e, image_id)

wd = getcwd()
for image_set in sets:
    if not os.path.exists('data/labels/'):
        os.makedirs('data/labels/')
    image_ids = open('data/labels/%s.txt' %
                     (image_set)).read().strip().split()
    list_file = open('data/%s.txt' % (image_set), 'w')
    for image_id in tqdm(image_ids):
        list_file.write('data/images/%s.jpg\n' % (image_id))
        convert_annotation(image_id)
    list_file.close()
AI写代码
python
运行

以上代码中classes = [“你要训练的标签名称”]，在本代码中我要训练的数据是识别1和5所以我这里改成了“1”和“5”。大家根据自己的情况进行修改。运行此代码，运行后的结果如下图所示：



 接下来在data文件夹中新建myvoc.yaml文件，具体操作以及代码如下图所示：



 这里一定要注意一点在train,val,nc,names冒号后面一定要空一格，要判断正确不正确，只要看这几个关键字有没有变颜色，要是变颜色那就说明是正确的。最后再修改models下的yolov5s.yaml文件，具体修改方式如下图所示:

 至此，我们就完成了数据预处理以及代码的修改。

 六、训练自己的数据

接下来，我们就可以训练自己的数据了。首先打开终端并进入到yolov5的工程目录中：



 然后输入命令：

python train.py --epoch 300 --batch 4 --data ./data/myvoc.yaml --cfg ./models/yolov5s.yaml --weight ./weights/yolov5s.pt --workers 0   进行训练，如果出现内存不足的错误，将batch后面的4进一步改小，应该就不会出问题。

 

 训练结束后，我们就可以看到训练好模型存储的位置，具体如下图所示：



 找到训练好的模型last.py将其复制在weights文件下，具体如下图所示：



至此我们就完成了模型的训练。 如果训练提前终止，不能按照自己设定的epoch进行训练，可以使用以下指令来训练：

python train.py --epoch 500 --patience 0 --batch 4 --data ./data/myvoc.yaml --cfg ./models/yolov5s.yaml --weight ./weights/yolov5s.pt --workers 0

七、模型测试

训练完成后，我们可以进行模型的测试，测试一下刚刚训练的结果。打开命令行:

输入指令:

python detect.py --weight ./weights/last.pt --source 0



至此，我们就完成了在yolov5上训练自己的数据集，由于我的数据比较少，所以准确度不是很好，大家可以自行尝试训练其他的数据。Yolov3训练自己的数据也可以按照此方法进行，经过测试也可以进行训练。在过程中遇到问题时，大家也可以随时留言。

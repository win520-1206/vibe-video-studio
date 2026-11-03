# 科学依据与类比边界

模型：理想积分对象 dx/dt=u；恒定目标r；负比例反馈u=-k(x-r)，k=0.6/s。因此开启后e(t)=e0 exp(-k t)。11秒外部位移扰动使位置增加0.16，之后仍按同一闭环响应衰减。图中位置、箭头和误差曲线来自同一解析模型。

没有延迟、饱和或测量噪声；不能推广为所有反馈都稳定或越强越好。有限时间误差不归零。箭头长度编码修正量；回路线上的亮点是测量信息示意，不是实测通信速率。

依据：[University of Michigan feedback introduction](https://eecs.umich.edu/courses/eecs373.w05/lecture/control.html)；[CTMS PID design](https://ctms.engin.umich.edu/CTMS/index.php?example=Introduction&section=ControlPID)。指数解由本模型微分方程直接求得，并以独立数值测试核对。

结尾是作者感悟，控制系统模型不能证明人的价值或人生结论。


音乐：用户本机指定下载版，选段从原曲92.966667秒开始；不附公开包。主揭示对应算法候选瞬态，不宣称已审听。

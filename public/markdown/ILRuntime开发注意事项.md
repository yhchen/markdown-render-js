# ILRuntime开发注意事项

1. 避免使用 `struct` 结构，之前在 get 中返回 struct 对象会导致报错: ` System.NotSupportedException: Specified method is not supported.`
2. 避免跨域继承，跨域继承及跨域虚拟方法的重写都要手动编写适配器，具体写法可以参考 `Adapt_GComponent.cs` 文件
3. 如果遇到如下类型的问题: ` System.Collections.Generic.KeyNotFoundException: `，请根据提示将 `appdomain.DelegateManager.RegisterDelegateConvertor...` 系统提示中的内容添加到 `ILHelper.cs` 文件中
4. 假设有这样的一个类 `GTipView -> GComponent -> GObject`，`GTipView` 跨域继承于 `GComponent`. 那么如果一个 `GTipView` 对象转换为 `GObject` 对象之后，需要先将对象手动转换为 `GComponent`，再转换为 `GTipView` 才能生效,否则无法转换 
    ```c#
    // Example
    GTipView tip = new GTipView();
    GObject = obj = tip;
    GTipView target1 = (GTipView)obj.asCom; // correct
    GTipView target2 = (GTipView)(GComponent)obj; // correct
    GTipView target3 = (GTipView)obj; // !!! error !!!
    ```
6. 更新ILRuntime后，Enum的等值对比有问题，把ConfigAttribute中的枚举类型改成int类型，配置文件的Attribute也要做相应修改
    ```c#
    //旧代码
    [Config(AppType.ClientH | AppType.ClientM)]
    public class ExperiencerConfigCategory : ACategory<ExperiencerConfig>
    {
    }

    //新代码
    [Config((int)(AppType.ClientH | AppType.ClientM))]
    public class ExperiencerConfigCategory : ACategory<ExperiencerConfig>
    {
    }
    ```
7. To be continue...


# IOS真机注意事项

> 下面的问题都是iltocpp后在IOS真机出现的，一般表现为nullchek崩溃，而pc版（开了ILRuntime）正常。

1. 传delegate回调给主工程Model.dll时，不要使用带额外参数的嵌套lambda表达式。比如在Model.dll里面定义了一个参数为JsonData的回调SendRequest，在Hotfix.dll里面直接传callback函数进去没有问题：
    ```c#
    ETModel.HttpModule.Instance.SendRequest(
        proto.GetUrlHead(),
        proto.GetProtocolStr(),
        proto.GetRequestType(),
        ReadMainCallback
    );
    private void ReadMainCallback(JsonData data) { }
    ```

    但是如果想加参数，写成类似下面这种：

    ```c#
    ETModel.HttpModule.Instance.SendRequest(
        proto.GetUrlHead(),
        proto.GetProtocolStr(),
        proto.GetRequestType(),
        (data) =>
        {
            ReadMainCallback(data, otherparams);
            // bla bla bla
        }
    );

    private void ReadMainCallback(JsonData data, otherparams...etc) { }    
    ```

    则回调中如果出现New或者Activator.CreateInstance Hotfix.dll内部的类时，真机会报nullchek崩溃
    
2. ET框架内部各个模块之间大部分情况下是通过Event事件来通信，不过在Hotfix.dll里面要注意
    `不要嵌套Hotfix层的事件`。比如事件A触发函数里面又触发了事件B，则在事件B的触发函数里面，
    在GetComponent取组件的时候，有一定几率在真机上报nullchek崩溃。

3. 不要在Hotfix.dll的类里面`加两个或者两个以上的Attribute`，我想在ConfigCatogery的定义里面加一个
    额外的Attribute，结果真机上Activator.CreateInstance创建这个类的时候会报nullchek崩溃，类似这样：

    ```c#
    [Config((int)(AppType.ClientH | AppType.ClientM))]
    [ABConfig(ABConfigName.Exp)]
    public class ExperiencerConfigCategory : ACategory<ExperiencerConfig>
    {
    }
    ```

4. `不要定义Model.dll和Hotfix.dll都监听的事件`。如果一个事件A在热更层和主工程都监听了，那在IOS真机上，
    触发完一层的函数到另外一层时，很可能会报nullchek崩溃。
   
5. 在热更Hotfix.dll中，Component如果注册了Update（可能还包含Awake等其他的，没有测试）函数，则在`Update
    中不要触发Hotfix层的事件`，和第一点类似，在运行到new或者Activator.CreateInstance会报nullchek崩溃，
    无法创建Hotfix内部的类。
    
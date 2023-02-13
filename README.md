# pinia-zlj
主要api使用和pinia没什么区别
## 插件
```typescript
import {createPinia,persistentPlugin,crossPagePlugin} from "pinia-zlj"

const pinia=createPinia()

//plugins
pinia.use(persistentPlugin) // 持久化插件
pinia.use(crossPagePlugin)  // 跨页面通信插件

const app=createApp(App)

app.use(pinia)
```
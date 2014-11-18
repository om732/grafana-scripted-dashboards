# grafana-scripted_dashboards

## About
- Grafanaのscripted dashboardsとsensu-apiを連携してグラフを自動生成する
- グラフの内容はsensuで設定しているsubscriptionsに紐付いている

## 動作確認環境
- EC2
- ruby
- sensu-api
- httpd
- Graphite
- Grafana

## 設定方法
### ファイルの設置
- scripted.js
    - 「grafana/app/dashboards」以下に設置する
- json/
    - 「grafana/」以下に設置する

### webサーバ
- ubyをCGIで動作させる設定を追加する。Apacheの場合は以下の設定となる。
```
<Directory /opt/grafana/json>
    AddHandler cgi-script .rb
    Options ExecCGI
</Directory>
```

## アクセス
- http://xxx.xxx.xxx.xxx/#/dashboard/script/scripted.js

## 詳細は
- http://og732.hatenadiary.com/entry/2014/11/18/234807

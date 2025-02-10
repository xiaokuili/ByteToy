import fetch from 'node-fetch';

async function searchXiaohongshu() {
  const response = await fetch("https://edith.xiaohongshu.com/api/sns/web/v1/search/notes", {
    method: 'POST',
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en,zh-CN;q=0.9,zh;q=0.8", 
      "content-type": "application/json;charset=UTF-8",
      "cookie": "abRequestId=73c50b39-c4ba-5dd0-b959-e6a09aa02d37; a1=19420725acbv4y95gqbpevhgg8wv9dsu43z6mcwsw50000161004; webId=9916901f6e7f70abf8e4a5c64ca6d609; gid=yj4J8WqJ4D4dyj4J8WJ20qSESDh4vj2kADUduMEhxkkYEK28hjfM76888yKy88488W0JJJqy; x-user-id-creator.xiaohongshu.com=616522b30000000002026fb4; customerClientId=920170528708034; web_session=040069b01161fb583fe28607a5354ba4abb0c0; webBuild=4.55.1; xsecappid=xhs-pc-web; acw_tc=0a50896117391638619905211e027203be9f95023cce4ea3c5d6fbbb147eb5; unread={\"ub\":\"679e2500000000001801a26a\",\"ue\":\"67917411000000001703a41a\",\"uc\":17}; websectiga=f47eda31ec99545da40c2f731f0630efd2b0959e1dd10d5fedac3dce0bd1e04d; sec_poison_id=0ec8d277-d020-42b6-adbd-686aec42c8c9",
      "origin": "https://www.xiaohongshu.com",
      "priority": "u=1, i",
      "referer": "https://www.xiaohongshu.com/",
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
      "x-b3-traceid": "15d0b59beca2e177",
      "x-s": "XYW_eyJzaWduU3ZuIjoiNTYiLCJzaWduVHlwZSI6IngyIiwiYXBwSWQiOiJ4aHMtcGMtd2ViIiwic2lnblZlcnNpb24iOiIxIiwicGF5bG9hZCI6IjhlMzBjM2M3MzA3MmJiYzkzMzk5MTRlZGMxYzlhZGY0ZTIxZjk1NzZmNDhkMjk3MGNkZTFiYTUxZjI5ZWQ0NzcwZTMwZDdmZDc1ZWI4NzVjMGQzYjdiNGE0ZTgzNDFiOGQyYTU5YjY3MjdjYTA5ZDNlN2M1ZWFjMWU5NTkzNWI5MGJlNGIzZjkxNzU2NDk4ODVlMjgzYjEzZDQ1ODdiOGYzMmE2OGQyMmNjMmViYjQzYjlhZDVmOTkwODZkZTZlNmQwODc0OTA0YzhjNTFjODlkNjgyM2Q3M2QyNzc4N2ZiY2VjY2Q0N2Y5YmVmMzU0MzBlNTVjYjdhNWE1YmNmMmJkOWEyNWU0YzA1OTNjMTVlM2QzMWE5NjFlOGIwNDg0Y2E4MTBmYmU4NjA4ZjkwMjY0YjA2ODhjOGJmMjRkMzRkOTE0ZDkzMmNlMTMwNTQ0MGFlNWJlMDYwMmE3MDZjMjRiODA3MzI3NzRjZjc1ZWQxZmYxYzljZTY1ZmQ5OTczMTI2ZTM4MDM2NDQ5NGFjOWM2NmE2NzgwNzUyYzAwN2IwIn0=",
      "x-t": "1739163965477",
      "x-xray-traceid": "ca77200becb3e73d082ff9911c24b035"
    },
    body: JSON.stringify({
      "keyword": "deepseek-r1怎么用",
      "page": 2,
      "page_size": 20,
      "search_id": "2eee51ps2rlvfdqm8f99y",
      "sort": "general",
      "note_type": 0,
      "ext_flags": [],
      "image_formats": ["jpg","webp","avif"]
    })
  });

  const data = await response.json();
  data.data.items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, JSON.stringify(item, null, 2));
  });
}

searchXiaohongshu();
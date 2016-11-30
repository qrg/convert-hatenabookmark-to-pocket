# convert hatena bookmark to pocket

雑 script

1. Export hatena bookmarks as Atom feed format
	* http://b.hatena.ne.jp/-/my/config/data_management
2. Run `$ npm start ~/Downloads/dump.xml`
3. Import to pocket as delicious exported data
  * https://getpocket.com/import/delicious/

## notes

* Import as delicious data
  * Or will lose tags data
* Tags data cannot accept some prefix letters
  * ex.) `+sample` tag become `sample`


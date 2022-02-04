let cacheData = "app-v1";
this.addEventListener("install", evt => {
    evt.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/logo192.png',
                '/manifest.json',
                '/static/js/bundle.js',
                '/login',
                '/index.html',
                '/',
                '/users',
                '/about',
                '/images/daughter.png',
                '/images/son.png',
                '/students',
                '/menu.png',
                '/instruments',
                '/items',
                'https://cdnjs.cloudflare.com/ajax/libs/hamburgers/1.1.3/hamburgers.min.css',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
                '/images/man.png',
                'https://fonts.googleapis.com/css2?family=Kanit:wght@800;900&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap',
                '/instruments/tejasLee/Tejas Lee - Y.jpg',
                '/instruments/tejasLee/Tejas Lee.wav'

            ])
        })
    )
})


this.addEventListener("fetch", evt => {

    if (!navigator.onLine) {
        evt.respondWith(
            caches.match(evt.request).then((res => {
                if(res) {
                    return res
                }
                let requestUrl = evt.request.clone();
                fetch(requestUrl)
            }))
        )
    }

})

this.addEventListener('activate', function(event) {
    console.log('activando')
  })


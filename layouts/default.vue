<template>
  <div class="fredoka text-center">
    <Nav />
    <slot />
    <div class="flex justify-evenly mx-auto mt-20">
      <div class="">
        <img src="~/public/animasi/2.png" class="w-16" alt="" />
        <h1 class="text-warnaHeading">
          © 2024 Fahrizãldi . Banjarmasin, Indonesia
        </h1>
      </div>
      <div class="">
        <div class="flex gap-20 justify-between">
          <div>
            <h1 class="font-semibold mb-5">ELSEWHERE</h1>
            <ul class="text-start">
              <li class="mb-3">
                <a target="_blank" href="https://www.instagram.com/aldiiimf"
                  >Instagram</a
                >
              </li>
              <li class="mb-3">
                <a target="_blank" href="https://github.com/aldmf26">Github</a>
              </li>
              <li class="mb-3">
                <a target="_blank" href="https://www.youtube.com/@ALdMFbeat"
                  >Youtube</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h1 class="font-semibold mb-5">CONTACT</h1>
            <ul>
              <li class="mb-3">
                <a
                  href="https://wa.me/62895413111053?text=Aldi,aku%20butuh%20bantuan!"
                  target="_blank"
                  >Whatsapp</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
   
  </div>
</template>

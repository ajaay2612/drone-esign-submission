<script>
</script>

<div
    class="min-h-svh relative w-full flex justify-center items-center
lg:flex-row-reverse"
>
    <div class="lg:w-1/2 lg:h-screen">
        <div class=" lg:hidden absolute left-0 top-0 w-full h-full z-0">
            <enhanced:img
                class="w-full h-full object-cover"
                src="$lib/images/phoneBackground.png"
                alt="An alt text"
            />
        </div>
        <div class="hidden lg:block fixed w-1/2 h-full z-0">
            <enhanced:img
                class="w-full h-full object-cover"
                src="$lib/images/background.png"
                alt="An alt text"
            />
        </div>
    </div>

    <div
        class="w-[90%] lg:h-[80vh] 2xl:h-[75vh]
    lg:w-1/2"
    >
        <div
            class="relative bg-white py-[1em] rounded-[1em] w-full md:w-[28em]
        lg:w-[32em] mx-auto"
        >
            <a href="/" class="block w-[11em] mt-[1.6em] lg:mt-0 mb-[0.5em] mx-auto">
                <img
                    class="w-full h-full object-cover"
                    src="/assets/logo.svg"
                    alt=""
                />
            </a>
            <div
                class="flex min-h-full flex-col justify-center px-[2em] py-[1em] lg:px-[4em]"
            >
                <slot />
            </div>
        </div>
    </div>
</div>

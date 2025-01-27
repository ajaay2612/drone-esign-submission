<script>
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Alert.svelte";
    import { slide } from "svelte/transition";
    export let form;
    export let data;

</script>


    <h1 class="text-center text-[2em] font-medium leading-[1em]">
        Set New Password
    </h1>
    {#if !data.validToken}
        <div
            class="mt-1hem text-[1.1em] bg-red-100 border border-red-400 text-red-700 px-[1em] py-[0.7em] rounded-[0.5em] relative"
        >
            Invalid or expired reset token. Please request a new password reset.
        </div>
    {:else}      
        <div class="mt-[2em] w-full mx-auto">
            <form class="space-y-[1.1em]" method="POST" use:enhance>

                {#if form?.error}
                    <div transition:slide={{duration:300}} class="">
                        <Alert bind:form={form} error={true} />
                    </div>
                {/if}

                <input type="hidden" name="token" value={data.token} />

                <div class="space-y-[1.5em] mt-[0.3em]">
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="New Password"
                            minlength="8"
                            class="inputFields"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            class="inputFields"
                            required
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>
                <div>
                    <button type="submit" class="authButton">Reset Password</button>
                </div>
            </form>
        </div>
    {/if}

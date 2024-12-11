<script setup lang="ts">
    import { computed } from "vue";
    import zxcvbn, { type ZXCVBNResult } from "zxcvbn";

    const props = defineProps({
        password: {
            type: String
        }
    });

    class PasswordRating {
        percent: number = 0;
        color: string = "#348feb";
        label: string = "";
    };

    function getPasswordScorePercent(result: ZXCVBNResult): number
    {
        return ((result.score + 1) / 5) * 100;
    }

    function makeRating(result: ZXCVBNResult|undefined): PasswordRating
    {
        const rating = new PasswordRating();
        if(result === undefined)
            return rating;

        rating.percent = getPasswordScorePercent(result);
        switch(result.score)
        {
            case 0:
                rating.label = "Very Weak";
                rating.color = "#B25252";
                break;
            case 1:
                rating.label = "Weak";
                rating.color = "#F56C6C";
                break;
            case 2:
                rating.label = "Mid";
                rating.color = "#E6A23C";
                break;
            case 3:
                rating.label = "Strong";
                rating.color = "#67C23A";
                break;
            case 4:
                rating.label = "Very strong";
                rating.color = "#4E8E2F";
                break;
        }
        return rating;
    }

    const passwordRating = computed<PasswordRating>(() => {
        if(props.password === undefined || props.password == "")
            return makeRating(undefined);
        return makeRating(zxcvbn(props.password));
    });
</script>

<template>
    <div class="d-flex flex-row justify-stretch align-center ga-2">
        <v-progress-linear
            class="flex-1-1"
            :color="passwordRating.color"
            :model-value="passwordRating.percent"
            />
        <span class="flex-1-0">{{ passwordRating.label }}</span>
    </div>
</template>

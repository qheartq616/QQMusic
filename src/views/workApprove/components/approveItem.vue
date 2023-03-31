<template>
    <div>
        <van-checkbox-group v-model="checked" @change="getCheckList" ref="checkboxGroup">
          
            <van-cell-group inset>

                <van-cell v-for="(item, index) in propsList.approveList" clickable :key="index" @click="toggle(index)">
                    <template #default>
                        <div class="approve-content" >
                            <div class="approve-left">
                                <div class="approve-picture">
                                    {{ item.tbrxm.slice(item.tbrxm.length - 2, item.tbrxm.length) }}
                                </div>
                                <div class="approve-name">
                                    {{ item.tbrxm }}
                                </div>
                            </div>
                            <div class="approve-right">
                                <div class="approve-right-content">
                                    <div>
                                        <span>工作日期: </span>
                                        <span>{{ item.tbrq }}</span>
                                    </div>
                               
                                    <div>
                                        <span>姓名: </span>
                                        <span>{{ item.tbrxm }}</span>
                                    </div>
                                    <div>
                                        <span>工号: </span>
                                        <span>{{ item.tbrgh }}</span>
                                    </div>
                                    <div>
                                        <span>工时: </span>
                                        <span>{{ item.gs + 'h'}}</span>
                                    </div>
                                    <div>
                                        <span>工作类型: </span>
                                        <span>{{ item.gslx }}</span>
                                    </div>
                                    <div>
                                        <span>项目名称: </span>
                                        <span>{{ item.xmmc }}</span>
                                    </div>
                                    <div>
                                        <span>项目编号: </span>
                                        <span>{{ item.xmbh }}</span>
                                    </div>
                                    <div>
                                        <span>备注: </span>
                                        <span>{{ item.tbnr }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #right-icon>
                        <van-checkbox :name="item" :ref="el => checkboxRefs[index] = el" @click.stop />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-checkbox-group>
    </div>
</template>
<script setup>
import { ref, onBeforeUpdate, computed, defineEmits,  } from 'vue';

const checked = ref([]);
const checkboxRefs = ref([]);
const emit = defineEmits(['getCheckedList'])
const toggle = (index) => {
    checkboxRefs.value[index].toggle();
};
// 全选反选
const checkboxGroup = ref(null);
const checkAll = () => {
     checkboxGroup.value.toggleAll(true);
}
const toggleAll = () => {
    checkboxGroup.value.toggleAll();
}

onBeforeUpdate(() => {
    checkboxRefs.value = [];
});

// 接受父组件参数
const propsList = defineProps({
    approveList: {
        type: Array,
    }
})

// 获取标签页选择的复选框数据
function getCheckList(res) {

    emit('getCheckedList', JSON.parse(JSON.stringify(res)))
}
//暴露给父组件
defineExpose({
    checkAll,
    toggleAll,
    checked
})

</script>
<style lang="scss" scoped>
.approve-content {
    display: flex;

    .approve-left {
        width: 6rem;

        height: 20%;
        background: rgb(211 211 211 / 19%);
        text-align: center;
        padding: 12px 0;

        .approve-picture {
            width: 2.5rem;
            height: 2.5rem;
            margin: 0 auto;
            line-height: 2.5rem;
            background: #3e7fe7db;
            color: white;
            border-radius: 50%;
            font-size: 0.8rem;
        }

        .approve-name {
            margin-top: 4px;
            font-size: 1rem;
        }
    }

    .approve-right {
        width: calc(100% - 6rem);
        flex: auto;
        border: 3px solid rgba(211, 211, 211, 0.19);
        margin-right: 4px;
        min-height: 15rem;
        padding: 0.2rem;

        .approve-right-content {

            border: 2px solid rgba(211, 211, 211, 0.19);
            padding: 0 0.5rem;

            p {
                margin: 0.5rem 0;
            }
        }
    }

    


}
.van-cell-group--inset {
        margin: 0;

    }
.van-cell {
    padding-right: 0.5rem;
    padding-left: 0.5rem;

}

</style>
<template>
    <div class="nav-header">
        <img class="menu-icon" @click="changeSlider" :src="require('../../assets/icon/left-menu.png')" />
        <img class="main-icon" :src="require('../../assets/icon/top-icon.png')" />
        <div class="right-item">
            <div class="btn-s" v-if="accountid == 0" @click="toReg">{{GLOBAL.lanLocal['register_upper']}}</div>
            <div class="btn-w" v-if="accountid == 0" @click="toLogin">{{GLOBAL.lanLocal['login']}}</div>
            <div class="box-amount" v-if="accountid != 0" @click="toRecharge">
                <div style="flex: 1;padding-top:3px;">{{GLOBAL.currencySymbol}}&nbsp;{{amount}}</div>
                <img :src="require('../../assets/icon/add.png')" />
            </div>
            <div class="btn-w" v-if="accountid != 0" @click="toRecharge">{{GLOBAL.lanLocal['recharge']}}</div>
            <!-- <div class="lan-box" v-if="accountid == 0" @click="changeLan">
                <img class="sub-icon" v-for="(item, index) in lanData" :key="index + 1" v-if="lanCode == item.code"
                    :src="item.img" />
            </div>
            <div class="lan-masking" v-if="isShowLan" @click="changeLan">
                <div class="lan-modal" @click.stop="func1()">
                    <div class="lan-item" v-for="(item, index) in lanData" @click="setLan(item.code)">
                        <img class="icon" :src="item.img" />
                        <div>{{ item.title }}</div>
                    </div>
                </div>
            </div>
            <div class="wallert" v-if="accountid != 0">
                <div>{{GLOBAL.currencySymbol}}{{ amount }}</div>
                <img @click="toDeposit" :src="require('../../assets/icon/wallert.png')" />
            </div>
            <img v-if="accountid != 0" class="me-icon sub-icon" @click="toMe"
                :src="require('../../assets/icon/me-top.png')" /> -->
        </div>
    </div>
</template>
<script>
import md5 from 'js-md5';
export default {
    name: 'navheader',
    data() {
        return {
            lanCode: '',
            isShowLan: false
        }
    },
    created() {
        // let lanCode = localStorage.getItem(md5('__lanCode__'))
        // if (lanCode) {
        //     this.GLOBAL.lanCode = lanCode
        // }
        this.lanCode = this.GLOBAL.lanCode
    },
    watch: {
        amount: {
            immediate: true,
            handler(newValue, oldValue) {
            }
        },
        accountid: {
            immediate: true,
            handler(newValue, oldValue) {
            }
        }
    },
    props: {
        amount: {
            type: String,
            default: '0.00'
        },
        accountid: {
            type: Number,
            default: 0
        },
        lanData: {
            type: Array,
            default: []
        }
    },
    computed: {

    },
    mounted() { },
    methods: {
        setLan(code) {
            this.$emit("setLan", code)
        },
        changeLan() {
            this.isShowLan = !this.isShowLan
        },
        func1() {

        },
        changeSlider() {
            this.$emit('changeSlider')
        },
        func1() {
        },
        toLogin() {
            this.$emit('toLogin')
        },
        toReg() {
            this.$emit('toReg')
        },
        toRecharge() {
            this.$emit('toRecharge')
        },
    }
}
</script>
<style lang="less" scoped>
.nav-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    background: #201f27;
    padding: 0 12px;
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;

    

    .menu-icon {
        height: 38px;
        width: auto;
    }

    .main-icon {
        height: 38px;
        width: auto;
        margin-top: 4px;
        margin-left: 14px;
    }

    .right-item {
        flex: 1;
        display: flex;
        align-items:center;
        justify-content: flex-end !important;

        .btn-s {
            font-family: Arial;
             background:rgb(35,199,100);
             padding: 10px 4px;
             font-size: 10px;
             font-weight: 600;
            border-radius: 6px;
             color: #201f28;
        }

        .btn-w {
            font-family: Arial;
            margin-left: 6px;
            background:rgb(255,174,46);
             padding: 10px 4px;
             font-size: 10px;
             font-weight: 600;
            border-radius: 6px;
             color: #201f28;
        }

        .box-amount {
            color: rgb(255, 215, 39);
            border: 1px solid #999;
            border-radius: 4px;
            display:flex;
            align-items:center;
            box-sizing: border-box;
            font-size: 12px;
            padding: 0 4px;
            height: 30px;
            line-height: 30px;
            >img {
                height: 20px;
                width: auto;
                margin-left: 6px;
            }
        }

        .lan-box {
            font-size: 0;
            position: relative;
            padding-right: 10px;
        }

        .wallert {
            background-color: rgb(58, 64, 71);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px;
            box-sizing: border-box;
            width: 100px;
            height: 26px;
            border-radius: 8px;

            div {
                font-size: 12px;
                color: #fff;
            }

            img {
                width: 15px;
                height: 15px;
            }
        }

        .me-icon {
            margin-left: 6px;
        }
    }

    .amount-modal {
        position: absolute;
        top: 58px;
        right: 10px;
        height: 70px;
        width: 90px;
        z-index: 999;
        background-color: rgb(44, 52, 62);
        color: #f6f6f6;

        div {
            height: 35px;
            line-height: 35px;
            margin: 0 10px;
            font-size: 13px;
        }

        div:not(:last-child) {
            border-bottom: 1px solid rgb(34, 40, 48);
        }
    }

    .amount-modal::before {
        content: "";
        display: inline-block;
        position: absolute;
        right: 12px;
        top: -9px;
        border-bottom: 10px solid rgb(44, 52, 62);
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
    }
}

.lan-masking {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 998;
    height: 100%;
    width: 100%;
}


.lan-modal::before {
    content: "";
    display: inline-block;
    position: absolute;
    right: 12px;
    top: -9px;
    border-bottom: 10px solid rgb(39, 44, 50);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
}

.lan-modal {
    position: absolute;
    top: 55px;
    right: 12px;
    background-color: rgb(39, 44, 50);
    border-radius: 6px;

    .lan-item {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        padding: 0 20px;
        box-sizing: border-box;
                border-bottom: 1px solid rgb(44, 50, 57);

        .icon {
            height: 30px;
            width: 30px;
            margin-right: 8px;
        }

        div {
            color: rgb(144, 151, 161);
            font-size: 16px;
        }
    }
}
</style>
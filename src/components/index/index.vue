<template>
    <div>
        <div v-if="isShowSlider" class="slider-menu-masking" @click="changeSlider">
            <div class="slider-menu" @click.stop="func1()">
                <div class="download">
                    <img class="icon" :src="require('../../assets/slider/save.png')" />
                    <div>{{ GLOBAL.lanLocal['savetodesktop'] }}</div>
                </div>
                <div class="lan" @click="showPage(3)">
                    <img class="icon" :src="require('../../assets/slider/email.png')" />
                    <div>{{ GLOBAL.lanLocal['email'] }}</div>
                </div>
                <div class="lan" @click="changeLan">
                    <template v-for="(item, index) in lanData">
                        <img v-if="lanCode == item.code" class="icon" :src="item.img" />
                        <div v-if="lanCode == item.code" class="lan-desc">
                            <div>{{ item.title }}</div>
                            <img class="down" :src="require('../../assets/icon/down.png')" />
                        </div>
                    </template>
                    <div class="lan-box" v-if="isShowLan">
                        <div class="lan-item" v-for="(item, index) in lanData" @click="changeLanCode(item.code)">
                            <img class="icon" :src="item.img" />
                            <div>{{ item.title }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="loading-masking" v-if="loading">
            <div class="loading-page">
                <vue-simple-spinner size="large" line-fg-color="#f69b09"></vue-simple-spinner>
            </div>
        </div>
        <NavHeader v-if="tabIndex != 5 && tabIndex != 51" @changeSlider="changeSlider"
            @setLan="changeLanCode" @toLogin="showPage(5)" @toReg="showPage(51)" @toRecharge="showPage(6)" :accountid="GLOBAL.userInfo.accountid"
            :amount="amount" :lanData="lanData"></NavHeader>
        <HomePage v-if="tabIndex == 1" @toGame="toGame" @signin="signin" @reg="reg" @vip="showPage(11)"
            @toForgot="showPage(7)"></HomePage>
        <ActivityPage v-if="tabIndex == 2"></ActivityPage>
        <EmailPage v-if="tabIndex == 3"></EmailPage>
        <MyPage v-if="tabIndex == 4" @reload="reload" @logout="logout" @email="showPage(3)" @forgot="showPage(7)" :amount="amount" @vip="showPage(11)"></MyPage>
        <LoginPage v-if="tabIndex == 5" :isReg="isReg" @close="closeModal" @reload="reload" @reg="reg" @toForgot="showPage(7)"></LoginPage>
        <RegisterPage v-if="tabIndex == 51" @signin="signin" @close="closeModal" @success="reload"></RegisterPage>
        <DepositPage v-if="tabIndex == 6" @close="closeModal" @toBind="toBind" @toService="showPage(8)" @reload="reload">
        </DepositPage>
        <SharePage v-if="tabIndex == 10" @close="closeModal" @reload="reload"></SharePage>
        <VipPage v-if="tabIndex == 11" @close="closeModal" @toDeposit="toDeposit"></VipPage>
        <Tabbar :accountid="GLOBAL.userInfo.accountid" v-if="tabIndex != 5 && tabIndex != 51" :index="tabIndex" :emailCount="emailCount" @change="showPage">
        </Tabbar>
    </div>
</template>
<script>
import loadFile from "../../api/loadFile.js"
import md5 from 'js-md5';
import HomePage from '../home/home.vue'
import ActivityPage from '../activity/activity.vue'
import LoginPage from '../login/login.vue'
import RegisterPage from '../register/register.vue'
import MyPage from '../my/my.vue'
import DepositPage from '../deposit/deposit.vue'
import EmailPage from '../email/email.vue'
import SharePage from '../share/share.vue'
import VipPage from '../vip/vip.vue'
import NavHeader from '../navheader/navheader.vue'
import Tabbar from '../tabbar/tabbar.vue'
import AES from "../../common/AES.js"
import { v4 as uuidv4 } from 'uuid'
export default {
    name: 'index',
    components: { NavHeader, HomePage, Tabbar, LoginPage, MyPage, ActivityPage, DepositPage, EmailPage
        , RegisterPage, SharePage, VipPage },
    data() {
        return {
            id: 0,
            url: '',
            lanCode: '',
            lanData: [
                { 'code': 'por', 'img': require('../../assets/icon/por.png'), 'title': 'Portugal' },
                { 'code': 'en', 'img': require('../../assets/icon/en.png'), 'title': 'English' },
            ],
            tabIndex: 1,
            isShowSlider: false,
            activityList: [],
            loading: false,
            isShowLan: false,
            amount: '0.00',
            loginType: 1,
            innerHeight: 0,
            emailTimer: null,
            emailCount: 0,
            activeList: [],
            activetype: 0,
            customer: '',
            customerType: 0,
            isReg: false,
            turntableType: 0,
            signCover: 0,
            closeMasking: false,
            saveMasking: false,
            saveType: 0,
            webUrl: '',
        }
    },
    created() {
        this.innerHeight = window.innerHeight - 130
        let lanCode = localStorage.getItem(md5('__lanCode__'))
        if (lanCode) {
         this.GLOBAL.lanCode = lanCode
        }
        this.lanCode = this.GLOBAL.lanCode
        const lanLocal = loadFile("static/json/" + this.GLOBAL.lanCode + ".json", false);
        this.GLOBAL.lanLocal = lanLocal

        let config = loadFile("static/config.json", false)
        this.webUrl = config.weburl

        const json = loadFile("static/nonce", true);
        if (json != null) {
            this.GLOBAL.apiAesKey = json['api_aes_key'];
            this.GLOBAL.apiUrl = json['ip'];
        }
        let deviceid = localStorage.getItem(md5('__deviceid__'))
        if (deviceid) {
            deviceid = AES.decrypt(deviceid, this.GLOBAL.apiAesKey)
        } else {
            deviceid = uuidv4()
            localStorage.setItem(md5('__deviceid__'), AES.encrypt(deviceid, this.GLOBAL.apiAesKey))
        }
        this.GLOBAL.deviceid = deviceid
    },
    computed: {

    },
    mounted() {
        window.parent.postMessage(
            {
                cmd: 'jump',
                params: {
                    val: 1
                }
            }, '*'
        )
        window.addEventListener('message', event => {
            let data = event.data
            if (data.cmd === 'jump') {
                localStorage.setItem("only_data", 1)
                this.reload()
            }
        })
    },
    methods: {
        reload() {
            return ;
        },
        changeSaveMasking() {
            this.saveMasking = !this.saveMasking
        },
        saveDesktop() {
            this.changeSlider()
            const ua = navigator.userAgent.toLowerCase()
            if(ua.indexOf('android') != -1)
            {
                this.saveType = 1
            }else if(ua.indexOf('iphone') != -1) 
            {
                this.saveType = 2
            }
            this.changeSaveMasking()
        },
        changeCloseMasking() {
            this.closeMasking = !this.closeMasking
        },
        closeFrame(){
            localStorage.setItem("only_data", 1)
            this.changeCloseMasking()
            this.reload()
        },
        changeSign(signCover) {
            this.signCover = signCover;
            if(this.signCover == 0)
            {
                this.changeNormalT()
            }
        },
        changeTurntable(type) {
            let turntableType = this.turntableType
            this.turntableType = 0
            if(type == 0 && turntableType == 1)
            {
                this.changeHightT()
            }
        },
        closeActive() {
            if(this.activetype == 1)
            {
                this.activetype = -1
            }else if(this.activetype == 2)
            {
                this.activetype = -2
            }
            if(this.GLOBAL.userInfo.name)
            {
                this.getUserSign()
            }
        },
        toGame(url) {
            this.loading = true
            this.url = url
        },
        reg() {
            this.showPage(51)
        },
        signin() {
            this.showPage(5)
        },
        logout() {
            this.GLOBAL.userInfo.accountid = 0
            this.GLOBAL.userInfo.name = ''
            this.GLOBAL.userInfo.passcode = ''
            localStorage.removeItem(md5('__name__'))
            localStorage.removeItem(md5('__pwd_'))
            clearInterval(this.emailTimer)
            this.showPage(1)
        },
        func1() { },
        changeLan() {
            this.isShowLan = !this.isShowLan
        },
        showPage(index) {
            this.signCover = -1
            this.turntableType = -1
            this.isShowSlider = false
            if (this.tabIndex != index) {
                    this.tabIndex = index
                    this.closeActive()
                    window.scrollTo(0,0)
                }
        },
        changeSlider() {
            if (this.isShowSlider) {
                this.isShowSlider = !this.isShowSlider
                this.isShowLan = false
            } else {
                this.isShowSlider = !this.isShowSlider
            }
        },
        toDeposit() {
            if (!this.GLOBAL.userInfo.accountid || this.GLOBAL.userInfo.accountid == 0) {
                this.$toast.error(this.GLOBAL.lanLocal['nologin'], {
                    position: "top-center",
                    timeout: 2000,
                    closeOnClick: true,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                    draggable: true,
                    draggablePercent: 0.6,
                    showCloseButtonOnHover: false,
                    hideProgressBar: true,
                    closeButton: false,
                    icon: true,
                    rtl: false
                });
                return
            }
            localStorage.setItem("back", this.tabIndex)
            this.showPage(6)
        },
        toBind() {
            localStorage.setItem("back", this.tabIndex)
            this.showPage(9)
        },
        closeModal() {
            let back = localStorage.getItem("back")
            if (back) {
                this.showPage(Number(back))
                localStorage.removeItem("back")
            } else {
                this.showPage(1)
            }
            this.id = 0
        },
        changeLanCode(lanCode) {
            if (lanCode == this.lanCode) {
                this.showLan = false
                return
            }
            this.loading = true
            this.lanCode = lanCode
            localStorage.setItem(md5('__lanCode__'), this.lanCode)
            setTimeout(() => {
                window.location.reload()
            }, 100)
        },
    }
}
</script>

<style lang="less" scoped>
.slider-menu-masking {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.slider-menu {
    position: absolute;
    top: 60px;
    left: 0;
    z-index: 1;
    background-color: #000;
    height: -moz-calc(100vh - 130px);
    height: -webkit-calc(100vh - 130px);
    height: calc(100vh - 130px);
    width: 240px;
    overflow-y: scroll;
    padding: 22px 18px 70px;
    text-align: left;
    box-sizing: border-box;

    .activity-title {
        color: rgb(233, 222, 124);
        font-size: 16px;
    }

    .activity-list {
        margin: 10px 0 30px;

        .activity-item {
            margin-bottom: 6px;

            img {
                width: 100%;
                height: auto;
                border-radius: 6px;
            }
        }
    }

    .download,
    .lan {
        background-color: rgb(39, 44, 50);
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-radius: 6px;
        position: relative;
        padding: 0 16px;
        box-sizing: border-box;
        text-decoration: none;

        .icon {
            height: auto;
            width: 35px;
            margin-right: 8px;
        }

        div {
            color: rgb(144, 151, 161);
            font-size: 16px;
            font-family: Arial;
            line-height: 1;
        }

        .down {
            width: 21px;
            height: 12px;
        }
    }

    .lan {
        margin-top: 10px;
        position: relative;

        .lan-desc {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
        }

        .lan-box {
            position: absolute;
            left: 0;
            top: 52px;
            width: 100%;
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
                // border-bottom: 1px solid rgb(44, 50, 57);

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

    }
}


.active-content {
    width: calc(100vw - 40px);
    max-height: 100%;
    .img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
        overflow: hidden;
    }
    .topage {
        background: rgb(233, 116, 20);
        color: #fff;
        width: 115px;
        margin: 15px auto;
        border-radius: 20px;
    }
    .close {
        width: 16px;
        height: 16px;
        border-radius: 16px;
        border: 1px solid #fff;
        padding: 5px;
    }
}

.page-masking {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 998;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.frameBack {
    position: fixed;
    top: 20px;
    left: 24px;
    z-index: 9999;
    >img {
        height: 40px;
        width: 40px;
    }
}
.save-masking {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99999;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .save-box {
        background-color: rgba(0,0,0,0.8);
        border: 1px solid rgba(200,200,200,0.8);
        width: 80%;
        border-radius: 6px;
        padding: 6px;
        text-align:right;
        color: #fff;
        font-family: Arial;
        .close-icon {
            height: 24px;
            width: auto;
        }
        .save-title {
            text-align:center;
            font-size: 18px;
        }
        .save-content {
            padding: 14px;
            .tips {
                font-size: 16px;
                text-align:left;
                line-height:1.3;
            }
            .save-guide {
                position: relative;
                margin-top: 16px;
                .guide-bg {
                    width: 100%;
                    height: auto;
                }
                >div {
                    position: absolute;
                    top: 14px;
                    left: 0;
                    width: 100%;
                    font-size: 14px;
                    text-align:center;
                }
            }
            .android {
                >div {
                    color: #333;
                    top: calc(50% - 10px);
                    text-align: left;
                    padding-left: 62px;
                    width: 110px;
                    overflow: hidden;
                }
            }
            .tutorial {
                margin-top: 8px;
                width: 100%;
                height: auto;
            }
        }
        .save-desc {
            padding: 6px 26px 12px;
            font-size: 14px;
            color: #55abff;
            text-align: left;
            line-height:1.3;
        }
    }
}
.close-masking {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99999;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .close-box {
        background-color: rgba(0,0,0,0.8);
        width: 80%;
        border-radius: 6px;
        padding: 0 26px;
        box-sizing: border-box;
        .close-title {
            text-align:center;
            color: #fff;
            font-size: 18px;
            padding: 16px 0 10px;
        }
        .close-content {
            border-radius: 6px;
            padding: 18px 12px;
            font-size: 14px;
            text-align:left;
            color: #fff;
        }
        .close-btn {
            display: flex;
            align-items:center;
            justify-content: space-between;
            .cancel, .confirm {
                border-radius:4px;
                height: 42px;
                line-height: 42px;
                width: 120px;
                font-size: 16px;
                text-align:center;
                margin: 18px 0;
                font-family: Arial;
                font-weight: 400;
                letter-spacing: 1.2px;
            }
            .cancel {
                background-color:rgb(204,75,25);
                color: #fff;
            }
            .confirm {
                background-color:rgb(58,140,37);
                color: #fff;
            }
        }
    }
}
.gameFrame {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    border: 0;
    background-color: #201f27;
}
.empty {
    padding-top: 10px;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        height: 50px;
        width: auto;
    }
    .tips {
        text-align:center;
        font-size: 14px;
        color: #efcf7f;
    }
}
</style>
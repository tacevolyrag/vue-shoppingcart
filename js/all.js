// input 欄位驗證
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
// 表單驗證
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
// loading
Vue.component('loading', VueLoading);

// Class 設定檔案
VeeValidate.configure({
    classes: {
      valid: 'is-valid',
      invalid: 'is-invalid',
    }
  });
// 匯入語系檔案
import zh_TW from './zh_TW.js';
console.log(VueLoading);
// 加入至 VeeValidate 的設定檔案
VeeValidate.localize('tw', zh_TW);

new Vue({
    el: '#app',
    data: {
        products: [],
        detailProduct: {},
        cart: {},
        cartTotal: 0,
        isLoading: false,
        form:{
            email: '',
            tel: '',
            address: '',
            name: '',
            payment: '',
            message: '',
        },
        api: {
            path: 'https://course-ec-api.hexschool.io/',
            uuid: 'daa979c0-17ef-4c8f-8a22-f4834d3fce7a',
        },
    },
    methods: {
        // api/{uuid}/ec/products 取得產品列表
        getProducts() {
            const apiUrl = `${this.api.path}api/${this.api.uuid}/ec/products`;
            this.isLoading = true;
            axios.get(apiUrl)
            .then(res => {
                this.products = (res.data.data);
                this.isLoading = false;
            }).catch(err => {
                console.log(err)
            });
        },
        // 查看更多商品細節
        getProductDetail(id){
            // GET api/{uuid}/ec/product/{id} 取得單一產品
            const productUrl = `${this.api.path}api/${this.api.uuid}/ec/product/${id}`
            this.isLoading = true;
            axios.get(productUrl)
                .then(res => {
                    this.detailProduct = res.data.data;
                    this.$set(this.detailProduct, 'num', 0);
                    $('#detailModal').modal('show');
                    this.isLoading = false;
                }).catch(err => {
                    console.log(err);
                });            
        },
        // 取得購物車列表資訊
        getCart(){
            // api/{uuid}/ec/shopping
            const cartUrl = `${this.api.path}api/${this.api.uuid}/ec/shopping`;
            this.isLoading = true;
            axios.get(cartUrl)
                .then(res =>{
                    this.cart = res.data.data;
                    this.updateTotalPrice();
                    this.isLoading = false;
                }).catch(err => {
                    console.log(err);
                })
        },
        // 增加產品到購物車
        addToCart(item,quantity) {
            // api/{uuid}/ec/shopping
            const addCartUrl = `${this.api.path}api/${this.api.uuid}/ec/shopping`;
            this.isLoading = true;
            const cart = {
                product: item.id,
                quantity: 1
            };
            axios.post(addCartUrl,cart)
                .then(res => {
                    console.log(cart.product);
                    $('#detailModal').modal('hide');
                    this.getCart();
                }).catch(err => {
                    this.isLoading = false;
                    $('#cartModal').modal('show');
                });
        },
        // 購物車刪除單一產品
        removeItem(id) {
            // api/{uuid}/ec/shopping/{id}
            const removeUrl = `${this.api.path}api/${this.api.uuid}/ec/shopping/${id}`
            this.isLoading = true;
            axios.delete(removeUrl,id)
                .then( () => {
                    this.cart.forEach( item => {
                        this.cart.splice(id,1);
                        this.getCart();
                    });
                });
        },
        // 購物車刪除全部產品
        removeItems() {
            // api/{uuid}/ec/shopping/all/product
            const removeAllUrl = `${this.api.path}api/${this.api.uuid}/ec/shopping/all/product`
            this.isLoading = true;
            axios.delete(removeAllUrl)
                .then(() => {
                    this.cartTotal = 0;
                    this.getCart();
                });
        },
        // 更新總價格
        updateTotalPrice() {
            this.cartTotal = 0;
            this.cart.forEach(item => {
                this.cartTotal += item.quantity * item.product.price;
            });
        },
        // 購物車 減少or增加產品數量
        quantityUpdate(itemId, quantity) {
            // PATCH api/{uuid}/ec/shopping
            const item = {
                product: itemId,
                quantity: quantity
            };
            const patchUrl = `${this.api.path}api/${this.api.uuid}/ec/shopping`;
            axios.patch(patchUrl, item)
                .then(() => {
                    this.getCart();
                }).catch(err => {
                    console.log(err);
                })
        },
        submitData(){
            alert('送出成功');
        },
    },
    created() {
        this.getProducts();
        this.getCart();       
    },
});

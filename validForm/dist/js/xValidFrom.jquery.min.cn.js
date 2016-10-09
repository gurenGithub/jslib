
if (typeof window.xUtils === 'undefined') {
    window.xUtils = {};
}

if (typeof window.xUtils.errorMessages === 'undefined') 
{
window.xUtils.errorMessages={
            noChinese: '* Chinese character is not allowed.',
            required: '* 该字段为必填字段',
            email: '* 无效Email格式',
            minLength: '* Minimum {{1}} characters required.',
            maxLength: '* Maximum {{1}} characters allowed.',
            invalid:'无效数据格式'
        }
}
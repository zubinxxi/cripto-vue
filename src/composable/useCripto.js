import { ref, onMounted, computed } from "vue"

export default function useCripto() {
    
    const criptomonedas = ref([])
    const monedas = ref([
        { codigo: 'USD', texto: 'Dólar de Estados Unidos'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
    ])

    const cotizacion = ref({})

    const cargando = ref(false)

    onMounted(() =>{
        fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD')
            .then(respuesta => respuesta.json())
            .then(({Data}) => { 
            criptomonedas.value = Data
        })
    })

    const optenerCotizacion = async (cotizar) =>{
        cargando.value = true
        cotizacion.value = {}
        const {moneda, criptomoneda} = cotizar
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
        
        let respuesta = await fetch(url)
        let data = await respuesta.json()
      
        cargando.value = false
      
        cotizacion.value = data.DISPLAY[criptomoneda][moneda]
      
    }

    const mostrarResultado = computed(()=> {
        return Object.values(cotizacion.value).length > 0
    })
    
    return{
        monedas, criptomonedas, cotizacion, cargando, optenerCotizacion, mostrarResultado
    }
}
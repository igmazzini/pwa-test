
import preproApi from '@/api/preproApi';

export const getProviders = async () => {

  try {

    const { data } = await preproApi.get('/providers');

    return { ok: true, data };

  } catch (error) {

    console.error("Error getting providers: ", error);

    if (error.response.status == 401) {
      return { ok: false, error: 'Token vencido', status: error?.response?.status };
    }

    return { ok: false, error: 'Falló la carga de proveedores' };
  }
}

export const upload = async (provider) => {

  try {


    const params = {
      company_name: provider.company_name,
      status: provider.status,
      extra_data:{
        cuit:provider.cuit,
        cbu:provider.cbu,
        email:provider.email,
        phone:provider.phone,
        address:provider.address,
      }     

    }

    const { data } = await preproApi.post('/providers/', params);


    return { ok: true, data };

  } catch (error) {

    console.error("Error adding provider: ", error);

    if (error?.response?.status == 401) {

      return { ok: false, error: 'Token vencido', status: error?.response?.status };
    }


    return { ok: false, error: 'No se pudo cargar el proveedor' };
  }
}

export const update = async (provider) => {


  try {


    const params = {
      company_name: provider.company_name,
      status: provider.status,
      extra_data:{
        cuit:provider.cuit,
        cbu:provider.cbu,
        email:provider.email,
        phone:provider.phone,
        address:provider.address,
      }   
    }

    const { data } = await preproApi.put(`/providers/${provider.company_id}/`, params);


    return { ok: true, data };

  } catch (error) {

    console.error("Error updating provider: ", error);

    if (error.response.status == 401) {
      return { ok: false, error: 'Token vencido', status: error?.response?.status };
    }

    return { ok: false, error: 'No se pudo actualizar el proveedor' };

  }

}

export const annulate = async (providerId) => {

  try {

    const { data } = await preproApi.delete(`/providers/${providerId}/`);

    return { ok: true, data }

  } catch (error) {

    console.error("Error deleting provider: ", error);

    if (error.response.status == 401) {
      return { ok: false, error: 'Token vencido', status: error?.response?.status };
    }

    return { ok: false, error: 'No se pudo anular el proveedor' };

  }

}
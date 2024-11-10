// fetch helper functions
export const checkStatus = (response) => {
    if (response.ok) {
        // returns true if response status 200-299
        return response;
    }
    throw new Error('Request was either a 404 or 500');
}

export const json = (response) => response.json()
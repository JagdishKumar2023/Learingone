import React from 'react';

const Loader = () => {
    return (
         <View>
            <Lottie>
                <LottieView
                source={require('../assets/lottie/loader.json')}
                autoPlay
                loop
                />
            </Lottie>
         </View>
    )
}

export default Loader;

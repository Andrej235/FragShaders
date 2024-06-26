const sphereFragmentShader: string = /* glsl */ `
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
    };

    uniform DirectionalLight directionalLights[1];
    uniform vec3 uLightDirection;
    varying vec3 vLightDirectionView;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vCameraPosition;

    uniform float uFresnelNormalStrength;
    uniform float uFresnelStrength;
    uniform float uFresnelShininess;
    uniform float uFresnelBias;
    uniform vec3 uFresnelColor;

    void main() {
        // vec3 lightDirection = directionalLights[0].direction;
        // vec3 lightDirection = vec3(0.58, -0.43, .68);

/*         vec3  N         = normalize( vNormal );
        vec3  L         = normalize( -vLightDirectionView );
        vec3  V         = normalize( -vCameraPosition );
        vec3  H         = normalize( V + L );
    
        float NdotL     = dot(N, L);
        float NdotH     = dot(N, H);
    
        float shininess = 3.0;
        float kDiffuse  = max(0.0, NdotL);
        float kSpecular = (shininess + 2.0) * pow(max(0.0, NdotH), shininess) / (2.0 * 3.14159265); */

        vec3 halfWay = normalize(vCameraPosition + uLightDirection);
        float specular = dot(halfWay, vNormal);
        specular = pow(specular, 2.); //Power HAS to be a whole number, higher number = less bright spots
        specular = clamp(specular, 0., 1.);

        vec3 fresnelNormal = vNormal;
        fresnelNormal.xz *= uFresnelNormalStrength;
        fresnelNormal = normalize(fresnelNormal);
        float base = 1.0 - dot(vCameraPosition, fresnelNormal);
        float exponential = pow(base, uFresnelShininess);
        float R = exponential + uFresnelBias * (1.0 - exponential);
        R *= uFresnelStrength;
        vec3 fresnel = uFresnelColor * R;

        float diffuse = dot(uLightDirection, vNormal);
        // diffuse = normalize(diffuse); //Uncomment to get all shaded areas to be black  
        
        vec3 color = vec3(0.2, 0.2, .8) * diffuse;
        color += specular; 
        // color += fresnel;
        gl_FragColor = vec4(color, 1.0);
    }
`;

export default sphereFragmentShader;

import { useEffect } from 'react'

const FastlaneWatermark = (props) => {

    useEffect(() => {
        const initWatermark = async () => {
            const fastlaneWatermark = await props?.fastlane?.FastlaneWatermarkComponent({ includeAdditionalInfo: true })
            console.log('FastlaneIdentity: initWatermark', fastlaneWatermark)
            fastlaneWatermark.render('.flWatermark')
        }
        props.fastlane && initWatermark()
    }, [props.fastlane])

    return (
        <div className="border border-success p-2 flWatermark">
            <img alt="fastlane-watermark" src="https://www.paypalobjects.com/fastlane-v1/assets/fastlane-with-tooltip_en_sm_light.0808.svg" />
        </div>
    )
}

export default FastlaneWatermark
